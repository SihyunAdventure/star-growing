export interface Recipe {
  inputs: string[];       // sorted item IDs
  output: string;         // result item ID
  scienceNote?: string;   // why this combination works
  episode?: number;       // which episode this recipe belongs to
}

// All recipes for Ep1-Ep6
// inputs are sorted alphabetically for consistent lookup
export const RECIPES: Recipe[] = [
  // Ep1 빅뱅 레시피 (5개)
  { inputs: ['dust', 'dust'], output: 'hydrogen', scienceNote: '우주 초기, 먼지가 모여 수소가 되었다', episode: 1 },
  { inputs: ['hydrogen', 'hydrogen'], output: 'helium', scienceNote: '수소 핵융합 — 별의 심장이 하는 일', episode: 1 },
  { inputs: ['energy', 'energy'], output: 'heat', scienceNote: '에너지가 모이면 열이 된다', episode: 1 },
  { inputs: ['energy', 'heat'], output: 'light', scienceNote: '열이 충분하면 빛이 탄생한다', episode: 1 },
  { inputs: ['dust', 'hydrogen'], output: 'gasCloud', scienceNote: '성간 가스 구름의 시작', episode: 1 },

  // Ep2 별의 탄생 레시피 (8개)
  { inputs: ['helium', 'hydrogen'], output: 'lithium', scienceNote: '빅뱅 핵합성의 세 번째 원소', episode: 2 },
  { inputs: ['helium', 'lithium'], output: 'carbon', scienceNote: '헬륨과 리튬의 결합 (2-재료 대안 경로)', episode: 2 },
  { inputs: ['helium', 'helium'], output: 'carbon', scienceNote: '삼중 알파 과정 — 별 내부에서 탄소 생성', episode: 2 },
  { inputs: ['carbon', 'hydrogen'], output: 'nitrogen', scienceNote: 'CNO 순환 — 별의 또 다른 핵융합', episode: 2 },
  { inputs: ['carbon', 'helium'], output: 'oxygen', scienceNote: '별 내부 핵합성', episode: 2 },
  { inputs: ['gasCloud', 'gasCloud'], output: 'nebula', scienceNote: '가스 구름이 모여 성운이 된다', episode: 2 },
  { inputs: ['heat', 'nebula'], output: 'protostar', scienceNote: '성운이 압축되어 원시별 탄생', episode: 2 },
  { inputs: ['energy', 'gasCloud'], output: 'plasma', scienceNote: '가스에 에너지를 가하면 플라즈마', episode: 2 },

  // Ep3 항성 진화 레시피 (9개)
  { inputs: ['carbon', 'oxygen'], output: 'silicon', scienceNote: '탄소-산소 핵융합으로 규소가 탄생한다', episode: 3 },
  { inputs: ['oxygen', 'silicon'], output: 'iron', scienceNote: '규소 연소 -- 핵융합 사슬의 마지막 단계', episode: 3 },
  { inputs: ['plasma', 'protostar'], output: 'stellarWind', scienceNote: '원시별의 뜨거운 플라즈마가 항성풍이 된다', episode: 3 },
  { inputs: ['hydrogen', 'protostar'], output: 'mainSequence', scienceNote: '수소 핵융합이 안정되면 주계열성이 된다', episode: 3 },
  { inputs: ['helium', 'mainSequence'], output: 'redGiant', scienceNote: '수소를 소진한 별이 헬륨 연소로 팽창한다', episode: 3 },
  { inputs: ['iron', 'redGiant'], output: 'supernova', scienceNote: '철 핵이 붕괴하며 별이 폭발한다', episode: 3 },
  { inputs: ['supernova', 'supernova'], output: 'neutronStar', scienceNote: '초신성 잔해가 극도로 압축되어 중성자별이 된다', episode: 3 },
  { inputs: ['neutronStar', 'neutronStar'], output: 'blackHole', scienceNote: '중성자별이 합쳐져 블랙홀로 붕괴한다', episode: 3 },
  { inputs: ['redGiant', 'supernova'], output: 'blackHole', scienceNote: '거대한 별의 최후 -- 블랙홀 탄생 (대안 경로)', episode: 3 },

  // Ep4 행성 형성 레시피 (10개)
  { inputs: ['dust', 'stellarWind'], output: 'protoplanetaryDisk', scienceNote: '항성풍이 먼지를 모아 원반을 형성한다', episode: 4 },
  { inputs: ['dust', 'supernova'], output: 'protoplanetaryDisk', scienceNote: '초신성 잔해가 모여 새로운 원반이 된다 (대안 경로)', episode: 4 },
  { inputs: ['iron', 'silicon'], output: 'asteroid', scienceNote: '철과 규소 덩어리가 소행성이 된다', episode: 4 },
  { inputs: ['asteroid', 'asteroid'], output: 'rockyPlanet', scienceNote: '소행성들이 충돌하며 암석 행성으로 성장한다', episode: 4 },
  { inputs: ['gasCloud', 'helium'], output: 'gasPlanet', scienceNote: '가스 구름에 헬륨이 더해져 거대 가스 행성이 된다', episode: 4 },
  { inputs: ['hydrogen', 'oxygen'], output: 'water', scienceNote: '수소와 산소가 만나 물이 탄생한다', episode: 4 },
  { inputs: ['nitrogen', 'oxygen'], output: 'atmosphere', scienceNote: '질소와 산소가 행성을 감싸 대기가 된다', episode: 4 },
  { inputs: ['asteroid', 'rockyPlanet'], output: 'moon', scienceNote: '거대 충돌로 파편이 모여 위성이 된다', episode: 4 },
  { inputs: ['rockyPlanet', 'water'], output: 'ocean', scienceNote: '암석 행성에 물이 모여 바다가 형성된다', episode: 4 },
  { inputs: ['atmosphere', 'water'], output: 'ocean', scienceNote: '대기 중 수증기가 응결되어 바다가 된다 (대안 경로)', episode: 4 },

  // Ep5 생명의 기원 레시피 (11개)
  { inputs: ['carbon', 'water'], output: 'aminoAcid', scienceNote: '원시 바다에서 탄소와 물이 아미노산을 만들다', episode: 5 },
  { inputs: ['carbon', 'carbon'], output: 'lipid', scienceNote: '탄소 원자들이 긴 사슬로 연결되어 지방산이 된다', episode: 5 },
  { inputs: ['aminoAcid', 'energy'], output: 'rna', scienceNote: '아미노산에 에너지가 가해져 최초의 자기복제 분자 탄생', episode: 5 },
  { inputs: ['rna', 'rna'], output: 'dna', scienceNote: 'RNA가 이중 가닥으로 안정화되어 DNA가 된다', episode: 5 },
  { inputs: ['aminoAcid', 'aminoAcid'], output: 'protein', scienceNote: '아미노산들이 연결되어 단백질이 된다', episode: 5 },
  { inputs: ['lipid', 'protein'], output: 'cell', scienceNote: '단백질과 지질막이 합쳐져 최초의 세포 탄생', episode: 5 },
  { inputs: ['cell', 'light'], output: 'photosynthesis', scienceNote: '세포가 빛을 이용해 광합성을 시작한다', episode: 5 },
  { inputs: ['cell', 'energy'], output: 'mitochondria', scienceNote: '작은 세포가 큰 세포에 공생하여 미토콘드리아가 된다', episode: 5 },
  { inputs: ['protein', 'rna'], output: 'virus', scienceNote: 'RNA와 단백질 껍질이 결합하여 바이러스가 된다', episode: 5 },
  { inputs: ['cell', 'cell'], output: 'multicellular', scienceNote: '세포들이 협력하여 다세포생물이 탄생한다', episode: 5 },
  { inputs: ['cell', 'mitochondria'], output: 'multicellular', scienceNote: '미토콘드리아를 가진 세포들이 복잡한 생명으로 진화한다 (대안 경로)', episode: 5 },

  // Ep6 문명 레시피 (9개)
  { inputs: ['energy', 'multicellular'], output: 'neuron', scienceNote: '다세포생물에서 전기 신호를 전달하는 신경 세포가 분화한다', episode: 6 },
  { inputs: ['neuron', 'neuron'], output: 'brain', scienceNote: '뉴런들이 연결되어 뇌라는 네트워크를 형성한다', episode: 6 },
  { inputs: ['brain', 'light'], output: 'intelligence', scienceNote: '빛(정보)을 처리하는 뇌에서 지능이 발현된다', episode: 6 },
  { inputs: ['intelligence', 'intelligence'], output: 'language', scienceNote: '지능이 소통하면서 언어가 탄생한다', episode: 6 },
  { inputs: ['language', 'language'], output: 'civilization', scienceNote: '언어를 통해 지식이 축적되어 문명이 시작된다', episode: 6 },
  { inputs: ['civilization', 'light'], output: 'science', scienceNote: '문명이 세상을 관찰하며 과학이 탄생한다', episode: 6 },
  { inputs: ['science', 'science'], output: 'telescope', scienceNote: '과학 지식이 모여 우주를 관측하는 도구를 만든다', episode: 6 },
  { inputs: ['civilization', 'telescope'], output: 'spaceship', scienceNote: '우주를 본 문명이 별을 향한 우주선을 만든다', episode: 6 },
  { inputs: ['science', 'telescope'], output: 'spaceship', scienceNote: '과학과 관측 기술이 합쳐져 우주 탐사의 꿈을 실현한다 (대안 경로)', episode: 6 },
];

// Build a lookup map for fast recipe search (no episode filter)
const recipeMap = new Map<string, Recipe>();

function makeKey(inputs: string[]): string {
  return [...inputs].sort().join('+');
}

for (const recipe of RECIPES) {
  const key = makeKey(recipe.inputs);
  // Only set if not already in map (first recipe wins for fast lookup)
  if (!recipeMap.has(key)) {
    recipeMap.set(key, recipe);
  }
}

export function findRecipe(itemIds: string[], maxEpisode?: number): Recipe | undefined {
  if (maxEpisode === undefined) {
    const key = makeKey(itemIds);
    return recipeMap.get(key);
  }
  // With episode filter: iterate RECIPES array to respect maxEpisode
  const key = makeKey(itemIds);
  for (const recipe of RECIPES) {
    if (makeKey(recipe.inputs) === key) {
      if (recipe.episode !== undefined && recipe.episode <= maxEpisode) {
        return recipe;
      }
    }
  }
  return undefined;
}

export function findRecipeFor2(a: string, b: string, maxEpisode?: number): Recipe | undefined {
  return findRecipe([a, b], maxEpisode);
}
