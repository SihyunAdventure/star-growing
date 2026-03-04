export interface ItemDef {
  id: string;
  name: string;
  tier: number;
  emoji: string;
  color: number;
  glowColor: number;
  glowStrength: number; // 0-1, controls glow intensity
  scienceFact: string;
  productionRate: number; // stardust per second (base)
}

export const ITEMS: Record<string, ItemDef> = {
  // Tier 0 - Auto-generated
  dust: { id: 'dust', name: '성간 먼지', tier: 0, emoji: '🌫️', color: 0x8B7355, glowColor: 0x8B7355, glowStrength: 0.3, scienceFact: '우주에서 가장 흔한 물질', productionRate: 0 },
  energy: { id: 'energy', name: '에너지', tier: 0, emoji: '⚡', color: 0xFFD700, glowColor: 0xFFD700, glowStrength: 0.3, scienceFact: '모든 변화의 원동력', productionRate: 0 },

  // Tier 1 - Basic elements
  hydrogen: { id: 'hydrogen', name: '수소 (H)', tier: 1, emoji: '🔵', color: 0x4FC3F7, glowColor: 0x4FC3F7, glowStrength: 0.5, scienceFact: '우주에서 가장 풍부한 원소', productionRate: 1 },
  helium: { id: 'helium', name: '헬륨 (He)', tier: 1, emoji: '🟡', color: 0xFFF176, glowColor: 0xFFF176, glowStrength: 0.5, scienceFact: '수소 핵융합의 첫 산물', productionRate: 1 },
  heat: { id: 'heat', name: '열', tier: 1, emoji: '🔥', color: 0xFF5722, glowColor: 0xFF5722, glowStrength: 0.5, scienceFact: '운동 에너지의 집합', productionRate: 1 },
  light: { id: 'light', name: '빛', tier: 1, emoji: '✨', color: 0xFFFFE0, glowColor: 0xFFFFE0, glowStrength: 0.5, scienceFact: '열복사로 탄생한 광자', productionRate: 1 },
  gasCloud: { id: 'gasCloud', name: '가스 구름', tier: 1, emoji: '☁️', color: 0xB39DDB, glowColor: 0xB39DDB, glowStrength: 0.5, scienceFact: '별이 태어나는 요람', productionRate: 1 },

  // Tier 2 - Intermediate elements & proto-objects
  lithium: { id: 'lithium', name: '리튬 (Li)', tier: 2, emoji: '🔴', color: 0xEF5350, glowColor: 0xEF5350, glowStrength: 0.8, scienceFact: '빅뱅 핵합성의 산물', productionRate: 3 },
  carbon: { id: 'carbon', name: '탄소 (C)', tier: 2, emoji: '⚫', color: 0x424242, glowColor: 0x757575, glowStrength: 0.8, scienceFact: '삼중 알파 과정으로 탄생', productionRate: 3 },
  nitrogen: { id: 'nitrogen', name: '질소 (N)', tier: 2, emoji: '🔷', color: 0x1565C0, glowColor: 0x1565C0, glowStrength: 0.8, scienceFact: 'CNO 순환의 촉매', productionRate: 3 },
  oxygen: { id: 'oxygen', name: '산소 (O)', tier: 2, emoji: '🩵', color: 0x29B6F6, glowColor: 0x29B6F6, glowStrength: 0.8, scienceFact: '별 내부 핵합성의 산물', productionRate: 3 },
  nebula: { id: 'nebula', name: '성운', tier: 2, emoji: '🌌', color: 0x7E57C2, glowColor: 0x7E57C2, glowStrength: 0.8, scienceFact: '가스 구름이 모여 빛나는 우주의 정원', productionRate: 3 },
  protostar: { id: 'protostar', name: '원시별', tier: 2, emoji: '🌟', color: 0xFFB74D, glowColor: 0xFFB74D, glowStrength: 0.8, scienceFact: '가스 구름이 압축되어 빛나기 시작한 별의 씨앗', productionRate: 3 },
  plasma: { id: 'plasma', name: '플라즈마', tier: 2, emoji: '💜', color: 0xAB47BC, glowColor: 0xAB47BC, glowStrength: 0.8, scienceFact: '이온화된 가스, 우주 물질의 99%', productionRate: 3 },
};

export function getItemDef(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function getTierMultiplier(tier: number): number {
  return Math.pow(3, tier - 1);
}
