export interface ItemDef {
  id: string;
  name: string;
  tier: number;
  episode: number;
  emoji: string;
  color: number;
  glowColor: number;
  glowStrength: number; // 0-1, controls glow intensity
  scienceFact: string;
  productionRate: number; // stardust per second (base)
}

export const ITEMS: Record<string, ItemDef> = {
  // Tier 0 - Auto-generated (Episode 1)
  dust: { id: 'dust', name: '성간 먼지', tier: 0, episode: 1, emoji: '🌫️', color: 0x8B7355, glowColor: 0x8B7355, glowStrength: 0.3, scienceFact: '우주에서 가장 흔한 물질', productionRate: 0 },
  energy: { id: 'energy', name: '에너지', tier: 0, episode: 1, emoji: '⚡', color: 0xFFD700, glowColor: 0xFFD700, glowStrength: 0.3, scienceFact: '모든 변화의 원동력', productionRate: 0 },

  // Tier 1 - Basic elements (Episode 1)
  hydrogen: { id: 'hydrogen', name: '수소 (H)', tier: 1, episode: 1, emoji: '🔵', color: 0x4FC3F7, glowColor: 0x4FC3F7, glowStrength: 0.5, scienceFact: '우주에서 가장 풍부한 원소', productionRate: 1 },
  helium: { id: 'helium', name: '헬륨 (He)', tier: 1, episode: 1, emoji: '🟡', color: 0xFFF176, glowColor: 0xFFF176, glowStrength: 0.5, scienceFact: '수소 핵융합의 첫 산물', productionRate: 1 },
  heat: { id: 'heat', name: '열', tier: 1, episode: 1, emoji: '🔥', color: 0xFF5722, glowColor: 0xFF5722, glowStrength: 0.5, scienceFact: '운동 에너지의 집합', productionRate: 1 },
  light: { id: 'light', name: '빛', tier: 1, episode: 1, emoji: '✨', color: 0xFFFFE0, glowColor: 0xFFFFE0, glowStrength: 0.5, scienceFact: '열복사로 탄생한 광자', productionRate: 1 },
  gasCloud: { id: 'gasCloud', name: '가스 구름', tier: 1, episode: 1, emoji: '☁️', color: 0xB39DDB, glowColor: 0xB39DDB, glowStrength: 0.5, scienceFact: '별이 태어나는 요람', productionRate: 1 },

  // Tier 2 - Intermediate elements & proto-objects (Episode 2)
  lithium: { id: 'lithium', name: '리튬 (Li)', tier: 2, episode: 2, emoji: '🔴', color: 0xEF5350, glowColor: 0xEF5350, glowStrength: 0.8, scienceFact: '빅뱅 핵합성의 산물', productionRate: 3 },
  carbon: { id: 'carbon', name: '탄소 (C)', tier: 2, episode: 2, emoji: '⚫', color: 0x424242, glowColor: 0x757575, glowStrength: 0.8, scienceFact: '삼중 알파 과정으로 탄생', productionRate: 3 },
  nitrogen: { id: 'nitrogen', name: '질소 (N)', tier: 2, episode: 2, emoji: '🔷', color: 0x1565C0, glowColor: 0x1565C0, glowStrength: 0.8, scienceFact: 'CNO 순환의 촉매', productionRate: 3 },
  oxygen: { id: 'oxygen', name: '산소 (O)', tier: 2, episode: 2, emoji: '🩵', color: 0x29B6F6, glowColor: 0x29B6F6, glowStrength: 0.8, scienceFact: '별 내부 핵합성의 산물', productionRate: 3 },
  nebula: { id: 'nebula', name: '성운', tier: 2, episode: 2, emoji: '🌌', color: 0x7E57C2, glowColor: 0x7E57C2, glowStrength: 0.8, scienceFact: '가스 구름이 모여 빛나는 우주의 정원', productionRate: 3 },
  protostar: { id: 'protostar', name: '원시별', tier: 2, episode: 2, emoji: '🌟', color: 0xFFB74D, glowColor: 0xFFB74D, glowStrength: 0.8, scienceFact: '가스 구름이 압축되어 빛나기 시작한 별의 씨앗', productionRate: 3 },
  plasma: { id: 'plasma', name: '플라즈마', tier: 2, episode: 2, emoji: '💜', color: 0xAB47BC, glowColor: 0xAB47BC, glowStrength: 0.8, scienceFact: '이온화된 가스, 우주 물질의 99%', productionRate: 3 },

  // Tier 3 - Stellar evolution (Episode 3)
  iron: { id: 'iron', name: '철 (Fe)', tier: 3, episode: 3, emoji: '', color: 0xB0BEC5, glowColor: 0x90A4AE, glowStrength: 0.6, scienceFact: '핵융합의 마지막 산물, 별의 죽음의 신호', productionRate: 9 },
  silicon: { id: 'silicon', name: '규소 (Si)', tier: 3, episode: 3, emoji: '', color: 0xA1887F, glowColor: 0xBCAAA4, glowStrength: 0.6, scienceFact: '암석과 반도체의 기본 원소', productionRate: 9 },
  stellarWind: { id: 'stellarWind', name: '항성풍', tier: 3, episode: 3, emoji: '', color: 0x80DEEA, glowColor: 0x4DD0E1, glowStrength: 0.6, scienceFact: '별에서 뿜어져 나오는 입자의 흐름', productionRate: 9 },
  mainSequence: { id: 'mainSequence', name: '주계열성', tier: 3, episode: 3, emoji: '', color: 0xFFF59D, glowColor: 0xFFEE58, glowStrength: 0.6, scienceFact: '수소 핵융합으로 안정적으로 빛나는 별', productionRate: 9 },
  redGiant: { id: 'redGiant', name: '적색거성', tier: 3, episode: 3, emoji: '', color: 0xE57373, glowColor: 0xEF5350, glowStrength: 0.6, scienceFact: '수소를 소진한 별이 팽창한 형태', productionRate: 9 },
  supernova: { id: 'supernova', name: '초신성', tier: 3, episode: 3, emoji: '', color: 0xFFAB40, glowColor: 0xFF6D00, glowStrength: 0.6, scienceFact: '별의 폭발적 최후, 무거운 원소의 요람', productionRate: 9 },
  neutronStar: { id: 'neutronStar', name: '중성자별', tier: 3, episode: 3, emoji: '', color: 0x7986CB, glowColor: 0x5C6BC0, glowStrength: 0.6, scienceFact: '초신성 잔해, 각설탕 크기가 10억 톤', productionRate: 9 },
  blackHole: { id: 'blackHole', name: '블랙홀', tier: 3, episode: 3, emoji: '', color: 0x37474F, glowColor: 0x263238, glowStrength: 0.6, scienceFact: '빛도 탈출할 수 없는 시공간의 특이점', productionRate: 9 },

  // Tier 4 - Planet formation (Episode 4)
  protoplanetaryDisk: { id: 'protoplanetaryDisk', name: '원시행성 원반', tier: 4, episode: 4, emoji: '', color: 0xFFCC80, glowColor: 0xFFB74D, glowStrength: 0.7, scienceFact: '별 주위를 도는 가스와 먼지의 원반', productionRate: 27 },
  asteroid: { id: 'asteroid', name: '소행성', tier: 4, episode: 4, emoji: '', color: 0x8D6E63, glowColor: 0x795548, glowStrength: 0.7, scienceFact: '태양계 형성의 잔해물', productionRate: 27 },
  rockyPlanet: { id: 'rockyPlanet', name: '암석 행성', tier: 4, episode: 4, emoji: '', color: 0xA1887F, glowColor: 0xD7CCC8, glowStrength: 0.7, scienceFact: '규소와 철로 이루어진 고체 행성', productionRate: 27 },
  gasPlanet: { id: 'gasPlanet', name: '가스 행성', tier: 4, episode: 4, emoji: '', color: 0xFFE0B2, glowColor: 0xFFCC80, glowStrength: 0.7, scienceFact: '수소와 헬륨으로 이루어진 거대 행성', productionRate: 27 },
  water: { id: 'water', name: '물 (H2O)', tier: 4, episode: 4, emoji: '', color: 0x4FC3F7, glowColor: 0x29B6F6, glowStrength: 0.7, scienceFact: '수소와 산소의 결합, 생명의 용매', productionRate: 27 },
  atmosphere: { id: 'atmosphere', name: '대기', tier: 4, episode: 4, emoji: '', color: 0x81D4FA, glowColor: 0x4FC3F7, glowStrength: 0.7, scienceFact: '행성을 감싸는 기체 층', productionRate: 27 },
  moon: { id: 'moon', name: '위성', tier: 4, episode: 4, emoji: '', color: 0xCFD8DC, glowColor: 0xB0BEC5, glowStrength: 0.7, scienceFact: '행성의 궤도를 도는 천체', productionRate: 27 },
  ocean: { id: 'ocean', name: '바다', tier: 4, episode: 4, emoji: '', color: 0x0277BD, glowColor: 0x0288D1, glowStrength: 0.7, scienceFact: '물이 모여 형성된 거대한 수역', productionRate: 27 },

  // Tier 5 - Origin of life (Episode 5)
  aminoAcid: { id: 'aminoAcid', name: '아미노산', tier: 5, episode: 5, emoji: '', color: 0x66BB6A, glowColor: 0x4CAF50, glowStrength: 0.8, scienceFact: '단백질의 기본 구성 단위', productionRate: 81 },
  lipid: { id: 'lipid', name: '지질', tier: 5, episode: 5, emoji: '', color: 0xFFD54F, glowColor: 0xFFC107, glowStrength: 0.8, scienceFact: '세포막의 기본 구성 요소', productionRate: 81 },
  rna: { id: 'rna', name: 'RNA', tier: 5, episode: 5, emoji: '', color: 0xF06292, glowColor: 0xEC407A, glowStrength: 0.8, scienceFact: '최초의 자기복제 분자', productionRate: 81 },
  dna: { id: 'dna', name: 'DNA', tier: 5, episode: 5, emoji: '', color: 0xBA68C8, glowColor: 0xAB47BC, glowStrength: 0.8, scienceFact: '생명의 설계도, 이중 나선 구조', productionRate: 81 },
  protein: { id: 'protein', name: '단백질', tier: 5, episode: 5, emoji: '', color: 0x4DB6AC, glowColor: 0x26A69A, glowStrength: 0.8, scienceFact: '생명 활동의 실행자', productionRate: 81 },
  cell: { id: 'cell', name: '세포', tier: 5, episode: 5, emoji: '', color: 0x81C784, glowColor: 0x66BB6A, glowStrength: 0.8, scienceFact: '생명의 기본 단위', productionRate: 81 },
  photosynthesis: { id: 'photosynthesis', name: '광합성', tier: 5, episode: 5, emoji: '', color: 0xAED581, glowColor: 0x9CCC65, glowStrength: 0.8, scienceFact: '빛 에너지를 화학 에너지로 전환', productionRate: 81 },
  mitochondria: { id: 'mitochondria', name: '미토콘드리아', tier: 5, episode: 5, emoji: '', color: 0xFF8A65, glowColor: 0xFF7043, glowStrength: 0.8, scienceFact: '세포의 발전소, 공생의 산물', productionRate: 81 },
  virus: { id: 'virus', name: '바이러스', tier: 5, episode: 5, emoji: '', color: 0x7E57C2, glowColor: 0x673AB7, glowStrength: 0.8, scienceFact: '생물과 무생물의 경계에 선 존재', productionRate: 81 },
  multicellular: { id: 'multicellular', name: '다세포생물', tier: 5, episode: 5, emoji: '', color: 0x26A69A, glowColor: 0x009688, glowStrength: 0.8, scienceFact: '세포들의 협력으로 탄생한 복잡한 생명', productionRate: 81 },

  // Tier 6 - Civilization (Episode 6)
  neuron: { id: 'neuron', name: '뉴런', tier: 6, episode: 6, emoji: '', color: 0xFFD740, glowColor: 0xFFC400, glowStrength: 0.9, scienceFact: '전기 신호로 정보를 전달하는 신경 세포', productionRate: 243 },
  brain: { id: 'brain', name: '뇌', tier: 6, episode: 6, emoji: '', color: 0xFFAB91, glowColor: 0xFF8A65, glowStrength: 0.9, scienceFact: '1000억 개 뉴런의 네트워크', productionRate: 243 },
  intelligence: { id: 'intelligence', name: '지능', tier: 6, episode: 6, emoji: '', color: 0xE1BEE7, glowColor: 0xCE93D8, glowStrength: 0.9, scienceFact: '추상적 사고와 문제 해결 능력', productionRate: 243 },
  language: { id: 'language', name: '언어', tier: 6, episode: 6, emoji: '', color: 0x80CBC4, glowColor: 0x4DB6AC, glowStrength: 0.9, scienceFact: '복잡한 의사소통 체계', productionRate: 243 },
  civilization: { id: 'civilization', name: '문명', tier: 6, episode: 6, emoji: '', color: 0xFFE082, glowColor: 0xFFD54F, glowStrength: 0.9, scienceFact: '지식과 기술의 축적체', productionRate: 243 },
  science: { id: 'science', name: '과학', tier: 6, episode: 6, emoji: '', color: 0x90CAF9, glowColor: 0x64B5F6, glowStrength: 0.9, scienceFact: '우주를 이해하려는 체계적 탐구', productionRate: 243 },
  telescope: { id: 'telescope', name: '망원경', tier: 6, episode: 6, emoji: '', color: 0xB39DDB, glowColor: 0x9575CD, glowStrength: 0.9, scienceFact: '우주를 향한 인류의 눈', productionRate: 243 },
  spaceship: { id: 'spaceship', name: '우주선', tier: 6, episode: 6, emoji: '', color: 0xE0E0E0, glowColor: 0xF5F5F5, glowStrength: 0.9, scienceFact: '별에서 태어나 별로 돌아가는 여정', productionRate: 243 },
};

export function getItemDef(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function getTierMultiplier(tier: number): number {
  return Math.pow(3, tier - 1);
}
