import { getItemDef, getTierMultiplier } from '../data/items';

export interface DiscoveredRecipe {
  inputs: string[];
  output: string;
  scienceNote: string;
}

export class GameState {
  stardust = 0;
  cosmicEnergy = 0;
  discoveredItems: Set<string> = new Set();
  boardItems: (string | null)[] = new Array(16).fill(null); // 4x4
  totalMerges = 0;

  // Recipe tracking
  discoveredRecipes: DiscoveredRecipe[] = [];
  private knownRecipeKeys = new Set<string>();

  // Event callbacks
  onDiscovery?: (itemId: string) => void;
  onRecipeDiscovered?: (recipe: DiscoveredRecipe) => void;
  onStardustChange?: () => void;

  constructor() {
    this.discoveredItems.add('dust');
    this.discoveredItems.add('energy');
  }

  discoverItem(itemId: string): boolean {
    if (this.discoveredItems.has(itemId)) return false;
    this.discoveredItems.add(itemId);
    const def = getItemDef(itemId);
    if (def) {
      this.cosmicEnergy += def.tier * 5 + 10;
    }
    this.onDiscovery?.(itemId);
    return true;
  }

  recordRecipe(inputs: string[], output: string, scienceNote: string): boolean {
    const key = [...inputs].sort().join('+') + '>' + output;
    if (this.knownRecipeKeys.has(key)) return false;
    this.knownRecipeKeys.add(key);
    const recipe: DiscoveredRecipe = { inputs, output, scienceNote };
    this.discoveredRecipes.push(recipe);
    this.onRecipeDiscovered?.(recipe);
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
      totalProduction += def.productionRate * getTierMultiplier(def.tier);
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
