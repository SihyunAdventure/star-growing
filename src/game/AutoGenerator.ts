import { WaitingSlots } from './WaitingSlots';
import { GameState } from './GameState';
import { Board } from './Board';

interface Generator {
  itemId: string;
  interval: number; // seconds
  elapsed: number;
}

export class AutoGenerator {
  private generators: Generator[] = [];
  private waitingSlots: WaitingSlots;
  private gameState: GameState;
  private board: Board;

  constructor(gameState: GameState, waitingSlots: WaitingSlots, board: Board) {
    this.gameState = gameState;
    this.waitingSlots = waitingSlots;
    this.board = board;

    // Dust: every 2 seconds
    this.generators.push({ itemId: 'dust', interval: 2, elapsed: 0 });

    // Energy: every 8 seconds (available from Episode 1)
    this.generators.push({ itemId: 'energy', interval: 8, elapsed: 0 });
  }

  getSpeedMultiplier(): number {
    return this.gameState.upgrades.getGeneratorMultiplier();
  }

  update(dt: number): void {
    if (this.waitingSlots.isFull()) return;

    const speedMultiplier = this.getSpeedMultiplier();

    for (const gen of this.generators) {
      gen.elapsed += dt * speedMultiplier;
      if (gen.elapsed >= gen.interval) {
        gen.elapsed -= gen.interval;
        if (!this.waitingSlots.isFull()) {
          this.waitingSlots.addItem(gen.itemId);
        }
      }
    }

    // Auto-merger: if upgrade unlocked and waiting slots have 2 of same item, auto-place on board
    if (this.gameState.upgrades.hasAutoMerger()) {
      this.tryAutoMerge();
    }
  }

  private tryAutoMerge(): void {
    const slots = this.waitingSlots.getSlots();
    // Find two slots with the same item
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i]) continue;
      for (let j = i + 1; j < slots.length; j++) {
        if (slots[j] === slots[i]) {
          // Found a pair — try placing both on the board
          const boardSlot1 = this.board.findEmptySlot();
          if (boardSlot1 < 0) return;
          const itemId = slots[i]!;
          this.waitingSlots.clearSlotAt(i);
          this.board.placeItem(boardSlot1, itemId);

          const boardSlot2 = this.board.findEmptySlot();
          if (boardSlot2 < 0) return;
          this.waitingSlots.clearSlotAt(j);
          this.board.placeItem(boardSlot2, itemId);
          return;
        }
      }
    }
  }
}
