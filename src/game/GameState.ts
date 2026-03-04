import { getItemDef, getTierMultiplier } from '../data/items';

export interface PlacedItem {
  itemId: string;
  slotIndex: number;
}

export class GameState {
  stardust = 0;
  cosmicEnergy = 0;
  discoveredItems: Set<string> = new Set();
  boardItems: (string | null)[] = new Array(16).fill(null); // 4x4
  totalMerges = 0;

  // Event callbacks
  onDiscovery?: (itemId: string) => void;
  onStardustChange?: () => void;

  constructor() {
    // Tier 0 items are always discovered
    this.discoveredItems.add('dust');
    this.discoveredItems.add('energy');
  }

  discoverItem(itemId: string): boolean {
    if (this.discoveredItems.has(itemId)) return false;
    this.discoveredItems.add(itemId);
    // Award cosmic energy for new discovery
    const def = getItemDef(itemId);
    if (def) {
      this.cosmicEnergy += def.tier * 5 + 10;
    }
    this.onDiscovery?.(itemId);
    return true;
  }

  placeOnBoard(slotIndex: number, itemId: string): boolean {
    if (slotIndex < 0 || slotIndex >= 16) return false;
    if (this.boardItems[slotIndex] !== null) return false;
    this.boardItems[slotIndex] = itemId;
    return true;
  }

  removeFromBoard(slotIndex: number): string | null {
    const item = this.boardItems[slotIndex];
    this.boardItems[slotIndex] = null;
    return item;
  }

  findEmptySlot(): number {
    return this.boardItems.indexOf(null);
  }

  getBoardItemCount(): number {
    return this.boardItems.filter(i => i !== null).length;
  }

  updateProduction(dt: number): void {
    let totalProduction = 0;
    for (const itemId of this.boardItems) {
      if (!itemId) continue;
      const def = getItemDef(itemId);
      if (!def || def.productionRate <= 0) continue;
      const tierMult = getTierMultiplier(def.tier);
      totalProduction += def.productionRate * tierMult;
    }
    if (totalProduction > 0) {
      this.stardust += totalProduction * dt;
      this.onStardustChange?.();
    }
  }

  getProductionPerSecond(): number {
    let total = 0;
    for (const itemId of this.boardItems) {
      if (!itemId) continue;
      const def = getItemDef(itemId);
      if (!def || def.productionRate <= 0) continue;
      total += def.productionRate * getTierMultiplier(def.tier);
    }
    return total;
  }
}
