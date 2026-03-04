import { getItemDef, getTierMultiplier } from '../data/items';
import { EpisodeProgress } from './EpisodeProgress';
import { UpgradeSystem } from './UpgradeSystem';
import { Recipe } from '../data/combinations';

export interface DiscoveredRecipe {
  inputs: string[];
  output: string;
  scienceNote: string;
}

export class GameState {
  stardust = 0;
  cosmicEnergy = 0;
  discoveredItems: Set<string> = new Set();
  boardItems: (string | null)[];
  totalMerges = 0;

  // Composition
  episodes = new EpisodeProgress();
  upgrades = new UpgradeSystem();

  // Recipe tracking
  discoveredRecipes: DiscoveredRecipe[] = [];
  private knownRecipeKeys = new Set<string>();

  // Event callbacks
  onDiscovery?: (itemId: string) => void;
  onRecipeDiscovered?: (recipe: DiscoveredRecipe) => void;
  onStardustChange?: () => void;

  constructor() {
    this.boardItems = new Array(this.upgrades.getBoardSize() ** 2).fill(null);
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
    if (slotIndex < 0 || slotIndex >= this.boardItems.length) return false;
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

  findRecipe(a: string, b: string): Recipe | undefined {
    return this.episodes.findRecipe(a, b);
  }

  resizeBoard(newSize: number): void {
    const oldSize = Math.round(Math.sqrt(this.boardItems.length));
    const newBoard: (string | null)[] = new Array(newSize * newSize).fill(null);
    for (let i = 0; i < this.boardItems.length; i++) {
      const item = this.boardItems[i];
      if (!item) continue;
      const row = Math.floor(i / oldSize);
      const col = i % oldSize;
      if (row < newSize && col < newSize) {
        const newIndex = row * newSize + col;
        newBoard[newIndex] = item;
      }
    }
    this.boardItems = newBoard;
  }

  purchaseUpgrade(upgradeId: string): boolean {
    const result = this.upgrades.purchase(upgradeId, this.stardust, this.cosmicEnergy);
    if (!result) return false;
    if (result.currency === 'stardust') {
      this.stardust -= result.cost;
    } else {
      this.cosmicEnergy -= result.cost;
    }
    this.onStardustChange?.();
    return true;
  }

  unlockEpisode(episode: number): boolean {
    const cost = this.episodes.getUnlockCost(episode);
    if (cost < 0 || this.cosmicEnergy < cost) return false;
    const success = this.episodes.unlockEpisode(episode);
    if (success) {
      this.cosmicEnergy -= cost;
    }
    return success;
  }
}
