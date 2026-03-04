import { UPGRADES, getUpgradeCost, UpgradeEffect } from '../data/upgrades';

export class UpgradeSystem {
  levels: Record<string, number> = {};

  // Callbacks
  onUpgradePurchased?: (upgradeId: string, effect: UpgradeEffect) => void;

  constructor() {
    // Initialize all upgrades at level 0
    for (const id of Object.keys(UPGRADES)) {
      this.levels[id] = 0;
    }
  }

  /** Get current level of an upgrade */
  getLevel(upgradeId: string): number {
    return this.levels[upgradeId] ?? 0;
  }

  /** Get cost for next level. Returns undefined if maxed out */
  getNextCost(upgradeId: string): { cost: number; currency: 'stardust' | 'cosmicEnergy' } | undefined {
    const def = UPGRADES[upgradeId];
    if (!def) return undefined;
    const currentLevel = this.getLevel(upgradeId);
    const cost = getUpgradeCost(upgradeId, currentLevel);
    if (cost === undefined) return undefined;
    return { cost, currency: def.currency };
  }

  /** Check if player can afford the upgrade */
  canAfford(upgradeId: string, stardust: number, cosmicEnergy: number): boolean {
    const next = this.getNextCost(upgradeId);
    if (!next) return false;
    if (next.currency === 'stardust') return stardust >= next.cost;
    return cosmicEnergy >= next.cost;
  }

  /** Purchase an upgrade. Returns the cost info if successful, or undefined if not.
   *  Caller is responsible for deducting resources. */
  purchase(upgradeId: string, stardust: number, cosmicEnergy: number): { cost: number; currency: 'stardust' | 'cosmicEnergy' } | undefined {
    if (!this.canAfford(upgradeId, stardust, cosmicEnergy)) return undefined;
    const next = this.getNextCost(upgradeId);
    if (!next) return undefined;

    const def = UPGRADES[upgradeId];
    const level = this.getLevel(upgradeId);
    this.levels[upgradeId] = level + 1;

    const effect = def.effects[Math.min(level, def.effects.length - 1)];
    this.onUpgradePurchased?.(upgradeId, effect);

    return next;
  }

  /** Get the current generator speed multiplier */
  getGeneratorMultiplier(): number {
    const level = this.getLevel('generatorSpeed');
    if (level === 0) return 1;
    const def = UPGRADES['generatorSpeed'];
    const effect = def.effects[Math.min(level - 1, def.effects.length - 1)];
    if (effect.type === 'generatorSpeed') return effect.multiplier;
    return 1;
  }

  /** Get current waiting slot count */
  getSlotCount(): number {
    return 3 + this.getLevel('waitingSlotExpansion');
  }

  /** Get current board size */
  getBoardSize(): number {
    return this.getLevel('boardExpansion') > 0 ? 5 : 4;
  }

  /** Check if auto merger is unlocked */
  hasAutoMerger(): boolean {
    return this.getLevel('autoMerger') > 0;
  }

  /** Check if an upgrade is maxed out */
  isMaxed(upgradeId: string): boolean {
    const def = UPGRADES[upgradeId];
    if (!def) return true;
    return this.getLevel(upgradeId) >= def.maxLevel;
  }
}
