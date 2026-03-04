import { WaitingSlots } from './WaitingSlots';
import { GameState } from './GameState';

interface Generator {
  itemId: string;
  interval: number; // seconds
  elapsed: number;
}

export class AutoGenerator {
  private generators: Generator[] = [];
  private waitingSlots: WaitingSlots;
  constructor(_gameState: GameState, waitingSlots: WaitingSlots) {
    this.waitingSlots = waitingSlots;

    // Dust: every 2 seconds
    this.generators.push({ itemId: 'dust', interval: 2, elapsed: 0 });

    // Energy: every 8 seconds (available from Episode 1)
    this.generators.push({ itemId: 'energy', interval: 8, elapsed: 0 });
  }

  update(dt: number): void {
    if (this.waitingSlots.isFull()) return;

    for (const gen of this.generators) {
      gen.elapsed += dt;
      if (gen.elapsed >= gen.interval) {
        gen.elapsed -= gen.interval;
        if (!this.waitingSlots.isFull()) {
          this.waitingSlots.addItem(gen.itemId);
        }
      }
    }
  }
}
