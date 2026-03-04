export type UpgradeEffect =
  | { type: 'generatorSpeed'; multiplier: number }
  | { type: 'waitingSlots'; addSlots: number }
  | { type: 'autoMerger' }
  | { type: 'boardExpansion'; newSize: number }
  | { type: 'recipeHint' };

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  currency: 'stardust' | 'cosmicEnergy';
  costs: number[];       // cost per level
  maxLevel: number;
  effects: UpgradeEffect[]; // effect per level
}

export const UPGRADES: Record<string, UpgradeDef> = {
  generatorSpeed: {
    id: 'generatorSpeed',
    name: '생성 가속',
    description: '아이템 생성 속도를 높입니다',
    currency: 'stardust',
    costs: [100, 300, 900, 2700],
    maxLevel: 4,
    effects: [
      { type: 'generatorSpeed', multiplier: 1.5 },
      { type: 'generatorSpeed', multiplier: 2 },
      { type: 'generatorSpeed', multiplier: 3 },
      { type: 'generatorSpeed', multiplier: 5 },
    ],
  },
  waitingSlotExpansion: {
    id: 'waitingSlotExpansion',
    name: '대기 슬롯 확장',
    description: '대기 슬롯을 추가합니다',
    currency: 'stardust',
    costs: [200, 800],
    maxLevel: 2,
    effects: [
      { type: 'waitingSlots', addSlots: 1 }, // 3->4
      { type: 'waitingSlots', addSlots: 1 }, // 4->5
    ],
  },
  autoMerger: {
    id: 'autoMerger',
    name: '자동 합성기',
    description: '동일 아이템을 자동으로 합성합니다',
    currency: 'stardust',
    costs: [5000],
    maxLevel: 1,
    effects: [
      { type: 'autoMerger' },
    ],
  },
  boardExpansion: {
    id: 'boardExpansion',
    name: '보드 확장',
    description: '보드를 5×5로 확장합니다',
    currency: 'cosmicEnergy',
    costs: [200],
    maxLevel: 1,
    effects: [
      { type: 'boardExpansion', newSize: 5 },
    ],
  },
  recipeHint: {
    id: 'recipeHint',
    name: '레시피 힌트',
    description: '미발견 레시피 1개를 공개합니다',
    currency: 'cosmicEnergy',
    costs: [30],
    maxLevel: 99, // effectively unlimited
    effects: [
      { type: 'recipeHint' },
    ],
  },
};

export function getUpgradeDef(id: string): UpgradeDef | undefined {
  return UPGRADES[id];
}

export function getUpgradeCost(id: string, currentLevel: number): number | undefined {
  const def = UPGRADES[id];
  if (!def || currentLevel >= def.maxLevel) return undefined;
  return def.costs[Math.min(currentLevel, def.costs.length - 1)];
}
