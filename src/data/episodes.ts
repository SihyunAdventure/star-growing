export interface EpisodeDef {
  id: number;
  name: string;
  description: string;
  unlockCost: number; // cosmic energy cost (ep1=0)
  tierRange: [number, number];
  bgTheme: {
    gradientFrom: string;
    gradientTo: string;
    starColor: number;
    starCount: number;
    particleColor?: number;
  };
  requiredItems: string[]; // items needed to complete episode
  finalItem: string;
}

export const EPISODES: EpisodeDef[] = [
  {
    id: 1,
    name: '빅뱅',
    description: '우주의 탄생, 원초적 에너지가 물질로 변하는 순간',
    unlockCost: 0,
    tierRange: [0, 1],
    bgTheme: {
      gradientFrom: '#0F0800',
      gradientTo: '#02020F',
      starColor: 0xFFCC80,
      starCount: 100,
    },
    requiredItems: [
      'dust',
      'energy',
      'hydrogen',
      'helium',
      'heat',
      'light',
      'gasCloud',
    ],
    finalItem: 'gasCloud',
  },
  {
    id: 2,
    name: '별의 탄생',
    description: '성운이 압축되어 원시별이 탄생하고 핵융합이 시작되다',
    unlockCost: 50,
    tierRange: [2, 2],
    bgTheme: {
      gradientFrom: '#0A0030',
      gradientTo: '#050518',
      starColor: 0xFFFFFF,
      starCount: 130,
      particleColor: 0xBB86FC,
    },
    requiredItems: [
      'lithium',
      'carbon',
      'nitrogen',
      'oxygen',
      'nebula',
      'protostar',
      'plasma',
    ],
    finalItem: 'protostar',
  },
  {
    id: 3,
    name: '항성 진화',
    description: '별이 핵융합을 거치며 무거운 원소를 만들고 장엄한 최후를 맞다',
    unlockCost: 150,
    tierRange: [3, 3],
    bgTheme: {
      gradientFrom: '#1A0505',
      gradientTo: '#070720',
      starColor: 0xFF8A65,
      starCount: 160,
    },
    requiredItems: [
      'iron',
      'silicon',
      'stellarWind',
      'mainSequence',
      'redGiant',
      'supernova',
      'neutronStar',
      'blackHole',
    ],
    finalItem: 'blackHole',
  },
  {
    id: 4,
    name: '행성 형성',
    description: '초신성 잔해에서 원반이 생기고, 충돌과 응집으로 행성과 바다가 탄생하다',
    unlockCost: 300,
    tierRange: [4, 4],
    bgTheme: {
      gradientFrom: '#020F1A',
      gradientTo: '#050518',
      starColor: 0x81D4FA,
      starCount: 120,
      particleColor: 0x4FC3F7,
    },
    requiredItems: [
      'protoplanetaryDisk',
      'asteroid',
      'rockyPlanet',
      'gasPlanet',
      'water',
      'atmosphere',
      'moon',
      'ocean',
    ],
    finalItem: 'ocean',
  },
  {
    id: 5,
    name: '생명의 기원',
    description: '원시 바다에서 분자가 자기복제를 시작하고 최초의 세포가 탄생하다',
    unlockCost: 500,
    tierRange: [5, 5],
    bgTheme: {
      gradientFrom: '#021A0F',
      gradientTo: '#020F0A',
      starColor: 0x80CBC4,
      starCount: 100,
      particleColor: 0x66BB6A,
    },
    requiredItems: [
      'aminoAcid',
      'lipid',
      'rna',
      'dna',
      'protein',
      'cell',
      'photosynthesis',
      'mitochondria',
      'virus',
      'multicellular',
    ],
    finalItem: 'multicellular',
  },
  {
    id: 6,
    name: '문명',
    description: '뉴런이 연결되어 지능이 깨어나고, 언어와 과학으로 별을 향해 나아가다',
    unlockCost: 800,
    tierRange: [6, 6],
    bgTheme: {
      gradientFrom: '#0A0520',
      gradientTo: '#070720',
      starColor: 0xFFD740,
      starCount: 180,
      particleColor: 0xE1BEE7,
    },
    requiredItems: [
      'neuron',
      'brain',
      'intelligence',
      'language',
      'civilization',
      'science',
      'telescope',
      'spaceship',
    ],
    finalItem: 'spaceship',
  },
];

export function getEpisodeDef(id: number): EpisodeDef | undefined {
  return EPISODES.find((ep) => ep.id === id);
}
