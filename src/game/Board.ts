import { Container, Graphics, Text, TextStyle, FillGradient } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from './GameState';
import { getItemDef } from '../data/items';
import { findRecipeFor2 } from '../data/combinations';
import { Panel, hexToRgba } from '../ui/Panel';
import { MergeEffect } from '../effects/MergeEffect';

const GRID_SIZE = 4;
const CELL_SIZE = 80;
const CELL_GAP = 6;
const BOARD_PADDING = 10;

export class Board {
  container: Container;
  width: number;
  height: number;

  private cells: Container[] = [];
  private cellBackgrounds: Graphics[] = [];
  private itemSprites: (Container | null)[] = [];
  private dragTarget: { sprite: Container; fromSlot: number; offsetX: number; offsetY: number } | null = null;
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();
    this.width = GRID_SIZE * (CELL_SIZE + CELL_GAP) - CELL_GAP + BOARD_PADDING * 2;
    this.height = this.width;

    this.itemSprites = new Array(GRID_SIZE * GRID_SIZE).fill(null);
    this.drawBoard();
  }

  private drawBoard(): void {
    // Board background - glassmorphism panel
    const panel = new Panel({
      width: this.width,
      height: this.height,
      radius: 16,
      gradient: true,
      gradientFrom: 0x1a1a4e,
      gradientTo: 0x0d0d28,
      fillAlpha: 0.8,
      strokeColor: 0x2a2a8e,
      strokeWidth: 2,
      strokeAlpha: 0.6,
    });
    this.container.addChild(panel);

    // Cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = BOARD_PADDING + col * (CELL_SIZE + CELL_GAP);
        const y = BOARD_PADDING + row * (CELL_SIZE + CELL_GAP);

        // Cell background with gradient
        const cellBg = new Graphics();
        const cellGrad = new FillGradient({
          type: 'linear',
          start: { x: 0.5, y: 0 },
          end: { x: 0.5, y: 1 },
          colorStops: [
            { offset: 0, color: hexToRgba(0x15153A, 0.6) },
            { offset: 1, color: hexToRgba(0x0D0D28, 0.6) },
          ],
        });
        cellBg.roundRect(0, 0, CELL_SIZE, CELL_SIZE, 10);
        cellBg.fill(cellGrad);
        cellBg.stroke({ color: 0x2a2a6e, width: 1, alpha: 0.3 });
        cellBg.x = x;
        cellBg.y = y;
        this.container.addChild(cellBg);
        this.cellBackgrounds.push(cellBg);

        // Cell container for items
        const cell = new Container();
        cell.x = x;
        cell.y = y;
        this.container.addChild(cell);
        this.cells.push(cell);

        // Make cell interactive for drop targets
        cellBg.eventMode = 'static';
        cellBg.cursor = 'pointer';
      }
    }
  }

  placeItem(slotIndex: number, itemId: string): boolean {
    if (!this.gameState.placeOnBoard(slotIndex, itemId)) return false;
    this.renderItem(slotIndex, itemId);
    return true;
  }

  private renderItem(slotIndex: number, itemId: string): void {
    // Remove existing sprite
    this.removeItemSprite(slotIndex);

    const def = getItemDef(itemId);
    if (!def) return;

    const cell = this.cells[slotIndex];
    const sprite = new Container();
    const cx = CELL_SIZE / 2;
    const cy = CELL_SIZE / 2;
    const baseRadius = CELL_SIZE / 2 - 6;

    // Glow layers (concentric circles with decreasing alpha)
    const glowDist = 8 + def.tier * 4; // 8, 12, 16 for tier 0, 1, 2
    const glowLayers = 4;
    for (let i = glowLayers; i > 0; i--) {
      const glow = new Graphics();
      const r = baseRadius + i * (glowDist / glowLayers);
      glow.circle(cx, cy, r);
      glow.fill({ color: def.glowColor, alpha: def.glowStrength * 0.06 * (glowLayers - i + 1) });
      sprite.addChild(glow);
    }

    // Item circle with radial gradient
    const circle = new Graphics();
    const radialGrad = new FillGradient({
      type: 'radial',
      center: { x: 0.45, y: 0.4 },
      innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.5 },
      outerRadius: 0.5,
      colorStops: [
        { offset: 0, color: hexToRgba(def.color, 0.5) },
        { offset: 0.7, color: hexToRgba(def.color, 0.25) },
        { offset: 1, color: hexToRgba(def.color, 0.1) },
      ],
    });
    circle.circle(cx, cy, baseRadius);
    circle.fill(radialGrad);
    circle.stroke({ color: def.color, width: 2, alpha: 0.8 });
    sprite.addChild(circle);

    // Emoji
    const emojiStyle = new TextStyle({
      fontSize: 32,
      align: 'center',
    });
    const emoji = new Text({ text: def.emoji, style: emojiStyle });
    emoji.anchor.set(0.5);
    emoji.x = cx;
    emoji.y = cy - 4;
    sprite.addChild(emoji);

    // Name label
    const nameStyle = new TextStyle({
      fontSize: 11,
      fill: 0xddddee,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: CELL_SIZE - 8,
    });
    const name = new Text({ text: def.name, style: nameStyle });
    name.anchor.set(0.5, 0);
    name.x = cx;
    name.y = CELL_SIZE - 18;
    sprite.addChild(name);

    // Make draggable
    sprite.eventMode = 'static';
    sprite.cursor = 'grab';

    sprite.on('pointerdown', (e) => {
      const pos = e.getLocalPosition(this.container);
      this.dragTarget = {
        sprite,
        fromSlot: slotIndex,
        offsetX: pos.x - sprite.x - cell.x,
        offsetY: pos.y - sprite.y - cell.y,
      };
      sprite.alpha = 0.7;
      sprite.zIndex = 100;
      // Move sprite to board container for free dragging
      const globalPos = cell.toGlobal({ x: sprite.x, y: sprite.y });
      const localPos = this.container.toLocal(globalPos);
      cell.removeChild(sprite);
      sprite.x = localPos.x;
      sprite.y = localPos.y;
      this.container.addChild(sprite);
      this.container.sortableChildren = true;
    });

    this.container.on('pointermove', (e) => {
      if (!this.dragTarget) return;
      const pos = e.getLocalPosition(this.container);
      this.dragTarget.sprite.x = pos.x - this.dragTarget.offsetX;
      this.dragTarget.sprite.y = pos.y - this.dragTarget.offsetY;
      this.highlightDropTarget(pos.x, pos.y);
    });

    this.container.on('pointerup', (e) => {
      if (!this.dragTarget) return;
      const pos = e.getLocalPosition(this.container);
      this.handleDrop(pos.x, pos.y);
    });

    this.container.on('pointerupoutside', () => {
      if (!this.dragTarget) return;
      this.returnToSlot(this.dragTarget.fromSlot);
    });

    this.container.eventMode = 'static';
    cell.addChild(sprite);
    this.itemSprites[slotIndex] = sprite;

    // Bounce-in animation
    gsap.from(sprite.scale, { x: 0, y: 0, duration: 0.25, ease: 'back.out(1.7)' });
  }

  private removeItemSprite(slotIndex: number): void {
    const sprite = this.itemSprites[slotIndex];
    if (sprite) {
      gsap.killTweensOf(sprite.scale);
      sprite.destroy();
      this.itemSprites[slotIndex] = null;
    }
  }

  private getCellAt(x: number, y: number): number {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cellBackgrounds[i];
      if (
        x >= cell.x && x <= cell.x + CELL_SIZE &&
        y >= cell.y && y <= cell.y + CELL_SIZE
      ) {
        return i;
      }
    }
    return -1;
  }

  private highlightDropTarget(x: number, y: number): void {
    // Reset all highlights
    for (const bg of this.cellBackgrounds) {
      bg.tint = 0xffffff;
    }
    const targetSlot = this.getCellAt(x, y);
    if (targetSlot >= 0 && this.dragTarget && targetSlot !== this.dragTarget.fromSlot) {
      const targetItem = this.gameState.boardItems[targetSlot];
      const fromItem = this.gameState.boardItems[this.dragTarget.fromSlot];
      if (targetItem && fromItem) {
        // Check if valid merge
        const recipe = findRecipeFor2(fromItem, targetItem);
        this.cellBackgrounds[targetSlot].tint = recipe ? 0x00ff88 : 0xff4444;
      } else {
        this.cellBackgrounds[targetSlot].tint = 0x4488ff;
      }
    }
  }

  private handleDrop(x: number, y: number): void {
    if (!this.dragTarget) return;
    const { fromSlot } = this.dragTarget;
    const targetSlot = this.getCellAt(x, y);

    // Reset highlights
    for (const bg of this.cellBackgrounds) {
      bg.tint = 0xffffff;
    }

    if (targetSlot < 0 || targetSlot === fromSlot) {
      this.returnToSlot(fromSlot);
      return;
    }

    const fromItem = this.gameState.boardItems[fromSlot];
    const targetItem = this.gameState.boardItems[targetSlot];

    if (!fromItem) {
      this.returnToSlot(fromSlot);
      return;
    }

    if (targetItem) {
      // Try merge
      const recipe = findRecipeFor2(fromItem, targetItem);
      if (recipe) {
        this.executeMerge(fromSlot, targetSlot, recipe.output);
      } else {
        this.returnToSlot(fromSlot);
      }
    } else {
      // Move to empty slot
      this.gameState.removeFromBoard(fromSlot);
      this.removeItemSprite(fromSlot);
      this.cleanupDrag();
      this.placeItem(targetSlot, fromItem);
    }
  }

  private executeMerge(fromSlot: number, targetSlot: number, outputId: string): void {
    // Remove both items
    this.gameState.removeFromBoard(fromSlot);
    this.gameState.removeFromBoard(targetSlot);
    this.removeItemSprite(fromSlot);
    this.removeItemSprite(targetSlot);
    this.cleanupDrag();

    // Play merge effect at target cell center
    const col = targetSlot % GRID_SIZE;
    const row = Math.floor(targetSlot / GRID_SIZE);
    const centerX = BOARD_PADDING + col * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
    const centerY = BOARD_PADDING + row * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
    const def = getItemDef(outputId);
    MergeEffect.play(this.container, centerX, centerY, def?.color ?? 0xffffff);

    // Place result (with bounce-in animation from renderItem)
    this.placeItem(targetSlot, outputId);
    this.gameState.totalMerges++;

    // Check for new discovery (triggers DiscoveryEffect via gameState.onDiscovery)
    this.gameState.discoverItem(outputId);
  }

  private returnToSlot(slotIndex: number): void {
    this.cleanupDrag();
    const itemId = this.gameState.boardItems[slotIndex];
    if (itemId) {
      this.renderItem(slotIndex, itemId);
    }
  }

  private cleanupDrag(): void {
    if (this.dragTarget) {
      if (this.dragTarget.sprite.parent === this.container) {
        this.container.removeChild(this.dragTarget.sprite);
      }
      this.dragTarget.sprite.destroy();
      this.dragTarget = null;
    }
  }

  findEmptySlot(): number {
    return this.gameState.findEmptySlot();
  }
}
