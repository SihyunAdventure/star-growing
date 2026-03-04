export interface Recipe {
  inputs: string[];       // sorted item IDs
  output: string;         // result item ID
  scienceNote?: string;   // why this combination works
}

// All recipes for Tier 0-2
// inputs are sorted alphabetically for consistent lookup
export const RECIPES: Recipe[] = [
  // Tier 1
  { inputs: ['dust', 'dust'], output: 'hydrogen', scienceNote: '우주 초기, 먼지가 모여 수소가 되었다' },
  { inputs: ['hydrogen', 'hydrogen'], output: 'helium', scienceNote: '수소 핵융합 — 별의 심장이 하는 일' },
  { inputs: ['energy', 'energy'], output: 'heat', scienceNote: '에너지가 모이면 열이 된다' },
  { inputs: ['energy', 'heat'], output: 'light', scienceNote: '열이 충분하면 빛이 탄생한다' },
  { inputs: ['dust', 'hydrogen'], output: 'gasCloud', scienceNote: '성간 가스 구름의 시작' },

  // Tier 2
  { inputs: ['helium', 'hydrogen'], output: 'lithium', scienceNote: '빅뱅 핵합성의 세 번째 원소' },
  { inputs: ['helium', 'lithium'], output: 'carbon', scienceNote: '헬륨과 리튬의 결합 (2-재료 대안 경로)' },
  { inputs: ['helium', 'helium', 'helium'], output: 'carbon', scienceNote: '삼중 알파 과정 — 별 내부에서 탄소 생성' },
  { inputs: ['carbon', 'hydrogen'], output: 'nitrogen', scienceNote: 'CNO 순환 — 별의 또 다른 핵융합' },
  { inputs: ['carbon', 'helium'], output: 'oxygen', scienceNote: '별 내부 핵합성' },
  { inputs: ['gasCloud', 'gasCloud'], output: 'nebula', scienceNote: '가스 구름이 모여 성운이 된다' },
  { inputs: ['heat', 'nebula'], output: 'protostar', scienceNote: '성운이 압축되어 원시별 탄생' },
  { inputs: ['energy', 'gasCloud'], output: 'plasma', scienceNote: '가스에 에너지를 가하면 플라즈마' },
];

// Build a lookup map for fast recipe search
const recipeMap = new Map<string, Recipe>();

function makeKey(inputs: string[]): string {
  return [...inputs].sort().join('+');
}

for (const recipe of RECIPES) {
  const key = makeKey(recipe.inputs);
  recipeMap.set(key, recipe);
}

export function findRecipe(itemIds: string[]): Recipe | undefined {
  const key = makeKey(itemIds);
  return recipeMap.get(key);
}

export function findRecipeFor2(a: string, b: string): Recipe | undefined {
  return findRecipe([a, b]);
}
