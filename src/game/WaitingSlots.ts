import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from './GameState';
import { Board } from './Board';
import { getItemDef } from '../data/items';
import { Panel } from '../ui/Panel';

const SLOT_COUNT = 3;
const SLOT_SIZE = 70;
const SLOT_GAP = 12;

export class WaitingSlots {
  container: Container;
  width: number;
  private slots: (string | null)[] = [null, null, null];
  private slotContainers: Container[] = [];
  private slotBackgrounds: Graphics[] = [];
  private pulseTweens: (gsap.core.Tween | null)[] = [];
  private board: Board;

  constructor(_gameState: GameState, board: Board) {
    this.board = board;
    this.container = new Container();
    this.width = SLOT_COUNT * (SLOT_SIZE + SLOT_GAP) - SLOT_GAP;

    this.drawSlots();
  }

  private drawSlots(): void {
    // Panel background
    const panelW = this.width + 20;
    const panelH = SLOT_SIZE + 36;
    const panel = new Panel({
      width: panelW,
      height: panelH,
      radius: 14,
      gradient: true,
      gradientFrom: 0x1a1a4e,
      gradientTo: 0x0d0d28,
      fillAlpha: 0.5,
      strokeColor: 0x2a2a6e,
      strokeWidth: 1,
      strokeAlpha: 0.4,
    });
    panel.x = -10;
    panel.y = -26;
    this.container.addChild(panel);

    // Label
    const label = new Text({
      text: '대기 슬롯',
      style: new TextStyle({ fontSize: 12, fill: 0x8888aa }),
    });
    label.x = this.width / 2;
    label.anchor.set(0.5, 1);
    label.y = -6;
    this.container.addChild(label);

    for (let i = 0; i < SLOT_COUNT; i++) {
      const x = i * (SLOT_SIZE + SLOT_GAP);

      const bg = new Graphics();
      bg.roundRect(0, 0, SLOT_SIZE, SLOT_SIZE, 10);
      bg.fill({ color: 0x15153A, alpha: 0.6 });
      bg.stroke({ color: 0x3a3a6e, width: 1, alpha: 0.5 });
      bg.x = x;
      this.container.addChild(bg);
      this.slotBackgrounds.push(bg);

      const slot = new Container();
      slot.x = x;
      this.container.addChild(slot);
      this.slotContainers.push(slot);

      // Tap to place on board
      bg.eventMode = 'static';
      bg.cursor = 'pointer';
      bg.on('pointertap', () => this.moveToBoard(i));

      this.pulseTweens.push(null);
    }
  }

  addItem(itemId: string): boolean {
    const emptyIndex = this.slots.indexOf(null);
    if (emptyIndex === -1) return false;

    this.slots[emptyIndex] = itemId;
    this.renderSlot(emptyIndex);
    return true;
  }

  isFull(): boolean {
    return this.slots.every(s => s !== null);
  }

  isEmpty(): boolean {
    return this.slots.every(s => s === null);
  }

  private moveToBoard(slotIndex: number): void {
    const itemId = this.slots[slotIndex];
    if (!itemId) return;

    const boardSlot = this.board.findEmptySlot();
    if (boardSlot < 0) return; // Board is full

    this.slots[slotIndex] = null;
    this.clearSlot(slotIndex);
    this.board.placeItem(boardSlot, itemId);
  }

  private renderSlot(index: number): void {
    this.clearSlot(index);
    const itemId = this.slots[index];
    if (!itemId) return;

    const def = getItemDef(itemId);
    if (!def) return;

    const slot = this.slotContainers[index];

    // Circle bg
    const circle = new Graphics();
    circle.circle(SLOT_SIZE / 2, SLOT_SIZE / 2, SLOT_SIZE / 2 - 6);
    circle.fill({ color: def.color, alpha: 0.2 });
    circle.stroke({ color: def.color, width: 1.5 });
    slot.addChild(circle);

    // Emoji
    const emoji = new Text({
      text: def.emoji,
      style: new TextStyle({ fontSize: 28 }),
    });
    emoji.anchor.set(0.5);
    emoji.x = SLOT_SIZE / 2;
    emoji.y = SLOT_SIZE / 2;
    slot.addChild(emoji);

    // Bounce-in animation
    gsap.from(slot.scale, { x: 0, y: 0, duration: 0.25, ease: 'back.out(1.7)' });

    // Pulse border effect on occupied slot
    const bg = this.slotBackgrounds[index];
    if (this.pulseTweens[index]) {
      this.pulseTweens[index].kill();
    }
    this.pulseTweens[index] = gsap.to(bg, {
      alpha: 0.7,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  private clearSlot(index: number): void {
    const slot = this.slotContainers[index];
    while (slot.children.length > 0) {
      slot.removeChildAt(0);
    }

    // Stop pulse animation and reset
    if (this.pulseTweens[index]) {
      this.pulseTweens[index].kill();
    }
    this.slotBackgrounds[index].alpha = 1;
  }
}
