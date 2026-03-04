import { Container, Graphics, Text, TextStyle, FillGradient } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from './GameState';
import { getItemDef } from '../data/items';
import { Panel, hexToRgba } from '../ui/Panel';
import { MergeEffect } from '../effects/MergeEffect';
import { createItemIcon } from '../ui/ItemRenderer';

const CELL_GAP = 6;
const BOARD_PADDING = 10;

export class Board {
  container: Container;
  width: number;
  height: number;

  private gridSize: number;
  private cellSize: number;
  private cells: Container[] = [];
  private cellBackgrounds: Graphics[] = [];
  private itemSprites: (Container | null)[] = [];
  private dragTarget: { sprite: Container; fromSlot: number; offsetX: number; offsetY: number } | null = null;
  private gameState: GameState;

  constructor(gameState: GameState, gridSize = 4) {
    this.gameState = gameState;
    this.gridSize = gridSize;
    this.cellSize = this.computeCellSize(gridSize);
    this.container = new Container();
    this.width = this.gridSize * (this.cellSize + CELL_GAP) - CELL_GAP + BOARD_PADDING * 2;
    this.height = this.width;

    this.itemSprites = new Array(this.gridSize * this.gridSize).fill(null);
    this.drawBoard();
    this.setupDragListeners();
  }

  private computeCellSize(gridSize: number): number {
    // Keep board visually similar regardless of grid size
    // Base: 4x4 => cellSize 80; scale inversely
    return Math.floor(80 * 4 / gridSize);
  }

  private drawBoard(): void {
    const panel = new Panel({
      width: this.width, height: this.height, radius: 16,
      gradient: true, gradientFrom: 0x1a1a4e, gradientTo: 0x0d0d28,
      fillAlpha: 0.8, strokeColor: 0x2a2a8e, strokeWidth: 2, strokeAlpha: 0.6,
    });
    this.container.addChild(panel);

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = BOARD_PADDING + col * (this.cellSize + CELL_GAP);
        const y = BOARD_PADDING + row * (this.cellSize + CELL_GAP);

        const cellBg = new Graphics();
        const cellGrad = new FillGradient({
          type: 'linear', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 },
          colorStops: [
            { offset: 0, color: hexToRgba(0x15153A, 0.6) },
            { offset: 1, color: hexToRgba(0x0D0D28, 0.6) },
          ],
        });
        cellBg.roundRect(0, 0, this.cellSize, this.cellSize, 10);
        cellBg.fill(cellGrad);
        cellBg.stroke({ color: 0x2a2a6e, width: 1, alpha: 0.3 });
        cellBg.x = x;
        cellBg.y = y;
        this.container.addChild(cellBg);
        this.cellBackgrounds.push(cellBg);

        const cell = new Container();
        cell.x = x;
        cell.y = y;
        this.container.addChild(cell);
        this.cells.push(cell);

        cellBg.eventMode = 'static';
        cellBg.cursor = 'pointer';
      }
    }
  }

  private setupDragListeners(): void {
    this.container.eventMode = 'static';

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
  }

  placeItem(slotIndex: number, itemId: string, animate = true): boolean {
    if (!this.gameState.placeOnBoard(slotIndex, itemId)) return false;
    this.renderItem(slotIndex, itemId, animate);
    return true;
  }

  private renderItem(slotIndex: number, itemId: string, animate = false): void {
    this.removeItemSprite(slotIndex);

    const def = getItemDef(itemId);
    if (!def) return;

    const cell = this.cells[slotIndex];
    const sprite = new Container();
    const cx = this.cellSize / 2;
    const cy = this.cellSize / 2;
    const baseRadius = this.cellSize / 2 - 6;

    // Pivot at center for proper scale animation
    sprite.pivot.set(cx, cy);
    sprite.x = cx;
    sprite.y = cy;

    // Glow layers
    const glowDist = 8 + def.tier * 4;
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
      center: { x: 0.45, y: 0.4 }, innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.5 }, outerRadius: 0.5,
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

    // Custom drawn icon (replaces emoji)
    const icon = createItemIcon(itemId, this.cellSize * 0.65, def.color);
    icon.x = cx;
    icon.y = cy - 2;
    sprite.addChild(icon);

    // Name label
    const name = new Text({
      text: def.name,
      style: new TextStyle({
        fontSize: 11, fill: 0xddddee, align: 'center',
        wordWrap: true, wordWrapWidth: this.cellSize - 8,
      }),
    });
    name.anchor.set(0.5, 0);
    name.x = cx;
    name.y = this.cellSize - 18;
    sprite.addChild(name);

    // Draggable
    sprite.eventMode = 'static';
    sprite.cursor = 'grab';

    sprite.on('pointerdown', (e) => {
      const pos = e.getLocalPosition(this.container);
      this.dragTarget = {
        sprite,
        fromSlot: slotIndex,
        offsetX: pos.x - (cell.x + sprite.x),
        offsetY: pos.y - (cell.y + sprite.y),
      };
      sprite.alpha = 0.7;
      sprite.zIndex = 100;
      const globalPos = cell.toGlobal({ x: sprite.x, y: sprite.y });
      const localPos = this.container.toLocal(globalPos);
      cell.removeChild(sprite);
      sprite.x = localPos.x;
      sprite.y = localPos.y;
      this.container.addChild(sprite);
      this.container.sortableChildren = true;
    });

    cell.addChild(sprite);
    this.itemSprites[slotIndex] = sprite;

    // Bounce-in only on first appearance (not on move/return)
    if (animate) {
      gsap.from(sprite.scale, { x: 0, y: 0, duration: 0.25, ease: 'back.out(1.7)' });
    }
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
      if (x >= cell.x && x <= cell.x + this.cellSize && y >= cell.y && y <= cell.y + this.cellSize) {
        return i;
      }
    }
    return -1;
  }

  private highlightDropTarget(x: number, y: number): void {
    for (const bg of this.cellBackgrounds) bg.tint = 0xffffff;
    const targetSlot = this.getCellAt(x, y);
    if (targetSlot >= 0 && this.dragTarget && targetSlot !== this.dragTarget.fromSlot) {
      const targetItem = this.gameState.boardItems[targetSlot];
      const fromItem = this.gameState.boardItems[this.dragTarget.fromSlot];
      if (targetItem && fromItem) {
        const recipe = this.gameState.findRecipe(fromItem, targetItem);
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

    for (const bg of this.cellBackgrounds) bg.tint = 0xffffff;

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
      const recipe = this.gameState.findRecipe(fromItem, targetItem);
      if (recipe) {
        this.executeMerge(fromSlot, targetSlot, recipe.output, [fromItem, targetItem], recipe.scienceNote);
      } else {
        this.returnToSlot(fromSlot);
      }
    } else {
      // Move to empty slot — no animation
      this.gameState.removeFromBoard(fromSlot);
      this.removeItemSprite(fromSlot);
      this.cleanupDrag();
      this.placeItem(targetSlot, fromItem, false);
    }
  }

  private executeMerge(fromSlot: number, targetSlot: number, outputId: string, inputIds: string[], scienceNote?: string): void {
    this.gameState.removeFromBoard(fromSlot);
    this.gameState.removeFromBoard(targetSlot);
    this.removeItemSprite(fromSlot);
    this.removeItemSprite(targetSlot);
    this.cleanupDrag();

    // Merge effect
    const col = targetSlot % this.gridSize;
    const row = Math.floor(targetSlot / this.gridSize);
    const centerX = BOARD_PADDING + col * (this.cellSize + CELL_GAP) + this.cellSize / 2;
    const centerY = BOARD_PADDING + row * (this.cellSize + CELL_GAP) + this.cellSize / 2;
    const def = getItemDef(outputId);
    MergeEffect.play(this.container, centerX, centerY, def?.color ?? 0xffffff);

    // Place result with bounce animation
    this.placeItem(targetSlot, outputId, true);
    this.gameState.totalMerges++;

    // Record recipe & check discovery
    this.gameState.recordRecipe(inputIds, outputId, scienceNote || '');
    this.gameState.discoverItem(outputId);
  }

  private returnToSlot(slotIndex: number): void {
    this.cleanupDrag();
    const itemId = this.gameState.boardItems[slotIndex];
    if (itemId) {
      this.renderItem(slotIndex, itemId, false);
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

  resize(newGridSize: number): void {
    this.cleanupDrag();
    this.container.eventMode = 'none';

    this.gridSize = newGridSize;
    this.cellSize = this.computeCellSize(newGridSize);
    this.width = this.gridSize * (this.cellSize + CELL_GAP) - CELL_GAP + BOARD_PADDING * 2;
    this.height = this.width;

    // Remove all existing children
    while (this.container.children.length > 0) {
      this.container.removeChildAt(0);
    }

    // Reset arrays
    this.cells = [];
    this.cellBackgrounds = [];
    this.itemSprites = new Array(this.gridSize * this.gridSize).fill(null);

    // Rebuild
    this.drawBoard();
    this.setupDragListeners();

    // Re-render existing items from gameState
    for (let i = 0; i < this.gameState.boardItems.length && i < this.itemSprites.length; i++) {
      const itemId = this.gameState.boardItems[i];
      if (itemId) {
        this.renderItem(i, itemId, false);
      }
    }

    this.container.eventMode = 'static';
  }
}
