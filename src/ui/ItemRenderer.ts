import { Container, Graphics, Text, TextStyle } from 'pixi.js';

/**
 * Creates a custom procedural icon for an item, centered at (0,0).
 */
export function createItemIcon(itemId: string, size: number, color: number): Container {
  const c = new Container();
  const draw = DRAWS[itemId];
  if (draw) draw(c, size, color);
  return c;
}

type DrawFn = (c: Container, s: number, col: number) => void;

const DRAWS: Record<string, DrawFn> = {
  dust: dDust,
  energy: dEnergy,
  hydrogen: (c, s, col) => dAtom(c, s, col, 'H', 1),
  helium: (c, s, col) => dAtom(c, s, col, 'He', 2),
  heat: dHeat,
  light: dLight,
  gasCloud: dCloud,
  lithium: (c, s, col) => dAtom(c, s, col, 'Li', 3),
  carbon: dCarbon,
  nitrogen: dNitrogen,
  oxygen: dOxygen,
  nebula: dNebula,
  protostar: dStar,
  plasma: dPlasma,
  // Episode 3 - Stellar Evolution
  mainSequence: dMainSequence,
  redGiant: dRedGiant,
  supernova: dSupernova,
  neutronStar: dNeutronStar,
  blackHole: dBlackHole,
  iron: (c, s, col) => dAtom(c, s, col, 'Fe', 4),
  silicon: (c, s, col) => dAtom(c, s, col, 'Si', 3),
  stellarWind: dStellarWind,
  // Episode 4 - Planet Formation
  asteroid: dAsteroid,
  rockyPlanet: dRockyPlanet,
  gasPlanet: dGasPlanet,
  water: dWater,
  atmosphere: dAtmosphere,
  protoplanetaryDisk: dProtoDisk,
  moon: dMoon,
  ocean: dOcean,
  // Episode 5 - Origin of Life
  aminoAcid: dAminoAcid,
  lipid: dLipid,
  rna: dRna,
  dna: dDna,
  protein: dProtein,
  cell: dCell,
  photosynthesis: dPhotosynthesis,
  mitochondria: dMitochondria,
  multicellular: dMulticellular,
  virus: dVirus,
  // Episode 6 - Civilization
  neuron: dNeuron,
  brain: dBrain,
  intelligence: dIntelligence,
  language: dLanguage,
  civilization: dCivilization,
  science: dScience,
  telescope: dTelescope,
  spaceship: dSpaceship,
};

// --- Dust: scattered particle cloud ---
function dDust(c: Container, size: number, color: number) {
  const g = new Graphics();
  const sc = size / 40;
  const dots = [
    [0, 0, 3.5], [-7, -5, 2.5], [6, -7, 2], [-9, 3, 2],
    [8, 5, 2.5], [-4, 8, 1.5], [4, -9, 1.5], [-10, -2, 1.5],
    [3, 10, 1.5], [9, -3, 1], [-6, -9, 1], [10, 1, 1],
  ];
  for (const [x, y, r] of dots) {
    g.circle(x * sc, y * sc, r * sc);
    g.fill({ color, alpha: 0.55 + (r / 3.5) * 0.4 });
  }
  c.addChild(g);
}

// --- Energy: lightning bolt ---
function dEnergy(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  g.poly([
    { x: s * 0.2, y: -s }, { x: -s * 0.3, y: -s * 0.05 },
    { x: s * 0.08, y: -s * 0.08 }, { x: -s * 0.2, y: s },
    { x: s * 0.3, y: s * 0.05 }, { x: -s * 0.08, y: s * 0.08 },
  ]);
  g.fill({ color, alpha: 0.9 });
  // center glow
  g.circle(0, 0, s * 0.18);
  g.fill({ color: 0xffffff, alpha: 0.5 });
  c.addChild(g);
}

// --- Atom: nucleus + orbital rings + element symbol ---
function dAtom(c: Container, size: number, color: number, symbol: string, orbitals: number) {
  const r = size * 0.4;

  // Orbital rings
  for (let i = 0; i < orbitals; i++) {
    const ring = new Graphics();
    ring.ellipse(0, 0, r, r * 0.32);
    ring.stroke({ color, width: 1.4, alpha: 0.4 });
    ring.rotation = (i / orbitals) * Math.PI;
    c.addChild(ring);

    // Electron dot
    const eAngle = (i * 2.1) + 0.5;
    const ex = Math.cos(eAngle) * r;
    const ey = Math.sin(eAngle) * r * 0.32;
    const cosR = Math.cos(ring.rotation), sinR = Math.sin(ring.rotation);
    const electron = new Graphics();
    electron.circle(0, 0, size * 0.04);
    electron.fill({ color, alpha: 0.85 });
    electron.x = ex * cosR - ey * sinR;
    electron.y = ex * sinR + ey * cosR;
    c.addChild(electron);
  }

  // Nucleus glow
  const glow = new Graphics();
  glow.circle(0, 0, size * 0.14);
  glow.fill({ color, alpha: 0.3 });
  c.addChild(glow);

  // Element symbol
  const text = new Text({
    text: symbol,
    style: new TextStyle({
      fontSize: size * (symbol.length > 1 ? 0.24 : 0.3),
      fill: 0xffffff, fontWeight: 'bold', fontFamily: 'monospace',
    }),
  });
  text.anchor.set(0.5);
  c.addChild(text);
}

// --- Heat: flame shape ---
function dHeat(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Outer flame
  g.moveTo(0, -s);
  g.bezierCurveTo(-s * 0.8, -s * 0.2, -s * 0.5, s * 0.7, 0, s);
  g.bezierCurveTo(s * 0.5, s * 0.7, s * 0.8, -s * 0.2, 0, -s);
  g.fill({ color, alpha: 0.8 });
  c.addChild(g);

  // Inner flame (brighter)
  const ig = new Graphics();
  const is2 = s * 0.45;
  ig.moveTo(0, -is2 * 0.4);
  ig.bezierCurveTo(-is2 * 0.5, is2 * 0.15, -is2 * 0.3, is2 * 0.8, 0, is2);
  ig.bezierCurveTo(is2 * 0.3, is2 * 0.8, is2 * 0.5, is2 * 0.15, 0, -is2 * 0.4);
  ig.fill({ color: 0xFFD700, alpha: 0.65 });
  ig.y = s * 0.1;
  c.addChild(ig);
}

// --- Light: 8-pointed starburst ---
function dLight(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.38;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.38;
    pts.push({ x: Math.cos(angle) * rad, y: Math.sin(angle) * rad });
  }
  g.poly(pts);
  g.fill({ color, alpha: 0.85 });
  g.circle(0, 0, r * 0.18);
  g.fill({ color: 0xffffff, alpha: 0.9 });
  c.addChild(g);
}

// --- Gas Cloud: overlapping soft circles ---
function dCloud(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.25;
  const blobs = [
    [0, -s * 0.35, s * 0.8], [-s * 0.65, s * 0.2, s * 0.7],
    [s * 0.65, s * 0.2, s * 0.7], [0, s * 0.1, s * 0.65],
    [-s * 0.3, -s * 0.5, s * 0.5], [s * 0.3, -s * 0.5, s * 0.5],
  ];
  for (const [x, y, r] of blobs) {
    g.circle(x, y, r);
    g.fill({ color, alpha: 0.22 });
  }
  c.addChild(g);
}

// --- Carbon: hexagonal ring + C ---
function dCarbon(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.32;
  // Outer hexagon
  const hex: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    hex.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  g.poly(hex);
  g.stroke({ color: 0xaaaaaa, width: 2, alpha: 0.75 });
  // Inner hexagon
  const ihex: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    ihex.push({ x: Math.cos(a) * r * 0.55, y: Math.sin(a) * r * 0.55 });
  }
  g.poly(ihex);
  g.stroke({ color, width: 1.5, alpha: 0.45 });
  c.addChild(g);

  const text = new Text({
    text: 'C',
    style: new TextStyle({ fontSize: size * 0.26, fill: 0xdddddd, fontWeight: 'bold', fontFamily: 'monospace' }),
  });
  text.anchor.set(0.5);
  c.addChild(text);
}

// --- Nitrogen: N₂ molecule with triple bond ---
function dNitrogen(c: Container, size: number, color: number) {
  const g = new Graphics();
  const d = size * 0.18;
  const ar = size * 0.12;
  // Two atoms
  g.circle(-d, 0, ar);
  g.fill({ color, alpha: 0.35 });
  g.circle(-d, 0, ar);
  g.stroke({ color, width: 1.5, alpha: 0.7 });
  g.circle(d, 0, ar);
  g.fill({ color, alpha: 0.35 });
  g.circle(d, 0, ar);
  g.stroke({ color, width: 1.5, alpha: 0.7 });
  // Triple bond lines
  for (const dy of [-size * 0.05, 0, size * 0.05]) {
    g.moveTo(-d + ar, dy);
    g.lineTo(d - ar, dy);
    g.stroke({ color, width: 1.2, alpha: 0.5 });
  }
  c.addChild(g);
  // Labels
  for (const x of [-d, d]) {
    const t = new Text({
      text: 'N',
      style: new TextStyle({ fontSize: size * 0.14, fill: 0xddddee, fontWeight: 'bold', fontFamily: 'monospace' }),
    });
    t.anchor.set(0.5);
    t.x = x;
    c.addChild(t);
  }
}

// --- Oxygen: O₂ with double bond ---
function dOxygen(c: Container, size: number, color: number) {
  const g = new Graphics();
  const d = size * 0.17;
  const ar = size * 0.13;
  // Two atoms
  g.circle(-d, 0, ar);
  g.fill({ color, alpha: 0.25 });
  g.circle(-d, 0, ar);
  g.stroke({ color, width: 1.5, alpha: 0.65 });
  g.circle(d, 0, ar);
  g.fill({ color, alpha: 0.25 });
  g.circle(d, 0, ar);
  g.stroke({ color, width: 1.5, alpha: 0.65 });
  // Double bond
  for (const dy of [-size * 0.035, size * 0.035]) {
    g.moveTo(-d + ar, dy);
    g.lineTo(d - ar, dy);
    g.stroke({ color, width: 1.3, alpha: 0.5 });
  }
  c.addChild(g);
  for (const x of [-d, d]) {
    const t = new Text({
      text: 'O',
      style: new TextStyle({ fontSize: size * 0.14, fill: 0xddddee, fontWeight: 'bold', fontFamily: 'monospace' }),
    });
    t.anchor.set(0.5);
    t.x = x;
    c.addChild(t);
  }
}

// --- Nebula: spiral of dots ---
function dNebula(c: Container, size: number, color: number) {
  const g = new Graphics();
  const count = 35;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 4.5;
    const dist = t * size * 0.38;
    const dotR = 1 + (1 - t) * 2.5;
    g.circle(Math.cos(angle) * dist, Math.sin(angle) * dist, dotR);
    g.fill({ color, alpha: 0.25 + t * 0.55 });
  }
  g.circle(0, 0, size * 0.07);
  g.fill({ color: 0xffffff, alpha: 0.5 });
  c.addChild(g);
}

// --- Protostar: 5-pointed star with rays ---
function dStar(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.36;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push({ x: Math.cos(angle) * rad, y: Math.sin(angle) * rad });
  }
  g.poly(pts);
  g.fill({ color, alpha: 0.9 });
  // Radiating lines
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.moveTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55);
    g.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 1.15);
    g.stroke({ color, width: 1, alpha: 0.35 });
  }
  g.circle(0, 0, r * 0.15);
  g.fill({ color: 0xffffff, alpha: 0.8 });
  c.addChild(g);
}

// --- Plasma: central orb with electric arcs ---
function dPlasma(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.12;
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.8 });
  // 3 lightning arcs
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const endDist = size * 0.35;
    const startX = Math.cos(angle) * r;
    const startY = Math.sin(angle) * r;
    const endX = Math.cos(angle) * endDist;
    const endY = Math.sin(angle) * endDist;
    g.moveTo(startX, startY);
    const segments = 4;
    for (let j = 1; j <= segments; j++) {
      const t = j / segments;
      const bx = startX + (endX - startX) * t;
      const by = startY + (endY - startY) * t;
      if (j < segments) {
        const off = ((j % 2) * 2 - 1) * size * 0.06;
        const px = -Math.sin(angle) * off;
        const py = Math.cos(angle) * off;
        g.lineTo(bx + px, by + py);
      } else {
        g.lineTo(endX, endY);
      }
    }
    g.stroke({ color, width: 1.5, alpha: 0.65 });
    g.circle(endX, endY, 2);
    g.fill({ color, alpha: 0.55 });
  }
  // center glow
  g.circle(0, 0, r * 1.6);
  g.fill({ color: 0xffffff, alpha: 0.15 });
  c.addChild(g);
}

// ============================================================
// EPISODE 3 - STELLAR EVOLUTION
// ============================================================

// --- Main Sequence: bright star with concentric heat-wave arcs ---
function dMainSequence(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.32;
  // Concentric partial arcs (heat waves)
  for (let i = 3; i >= 1; i--) {
    g.arc(0, 0, r * (1 + i * 0.22), -Math.PI * 0.7, Math.PI * 0.7);
    g.stroke({ color, width: 1.2, alpha: 0.18 * i });
    g.arc(0, 0, r * (1 + i * 0.22), Math.PI * 0.3, Math.PI * 1.7);
    g.stroke({ color, width: 1.2, alpha: 0.18 * i });
  }
  // Main body
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.88 });
  // bright core
  g.circle(0, 0, r * 0.38);
  g.fill({ color: 0xffffff, alpha: 0.55 });
  c.addChild(g);
}

// --- Red Giant: large expanded star with wavy edge ---
function dRedGiant(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.42;
  const pts: { x: number; y: number }[] = [];
  const steps = 36;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wave = 1 + 0.07 * Math.sin(i * 5);
    pts.push({ x: Math.cos(a) * r * wave, y: Math.sin(a) * r * wave });
  }
  g.poly(pts);
  g.fill({ color, alpha: 0.72 });
  g.poly(pts);
  g.stroke({ color: 0xff8844, width: 1.5, alpha: 0.5 });
  // core
  g.circle(0, 0, r * 0.28);
  g.fill({ color: 0xffddaa, alpha: 0.65 });
  c.addChild(g);
}

// --- Supernova: central point with 12 sharp radiating spikes ---
function dSupernova(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.38;
  const spikes = 12;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.22;
    pts.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
  }
  g.poly(pts);
  g.fill({ color, alpha: 0.85 });
  // outer glow ring
  g.circle(0, 0, r * 1.18);
  g.stroke({ color, width: 1.5, alpha: 0.25 });
  // bright core
  g.circle(0, 0, r * 0.12);
  g.fill({ color: 0xffffff, alpha: 0.95 });
  c.addChild(g);
}

// --- Neutron Star: small dense core with 4 magnetic field arcs ---
function dNeutronStar(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.13;
  // Magnetic field lines (crossing arcs)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI;
    const ex = Math.cos(a) * size * 0.38;
    const ey = Math.sin(a) * size * 0.38;
    g.moveTo(-ex, -ey);
    g.bezierCurveTo(
      -ex * 0.3 + ey * 0.55, -ey * 0.3 - ex * 0.55,
      ex * 0.3 + ey * 0.55,  ey * 0.3 - ex * 0.55,
      ex, ey
    );
    g.stroke({ color, width: 1.3, alpha: 0.45 });
  }
  // Dense core
  g.circle(0, 0, r);
  g.fill({ color: 0xffffff, alpha: 0.95 });
  g.circle(0, 0, r * 1.8);
  g.fill({ color, alpha: 0.35 });
  c.addChild(g);
}

// --- Black Hole: dark center with accretion disk and bent light ---
function dBlackHole(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.16;
  // Accretion disk (ellipse ring)
  g.ellipse(0, 0, size * 0.44, size * 0.13);
  g.stroke({ color, width: 2.5, alpha: 0.7 });
  // Light bending arcs
  for (let side of [-1, 1]) {
    g.arc(side * r * 1.4, 0, r * 1.1, Math.PI * 0.55, Math.PI * 1.45);
    g.stroke({ color: 0xffffaa, width: 1.2, alpha: 0.35 });
  }
  // Event horizon (black circle)
  g.circle(0, 0, r);
  g.fill({ color: 0x000000, alpha: 1 });
  g.circle(0, 0, r);
  g.stroke({ color, width: 1.5, alpha: 0.6 });
  c.addChild(g);
}

// --- Stellar Wind: central dot with curved streaming lines ---
function dStellarWind(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.08;
  // 6 curved stream lines
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const sx = Math.cos(a) * r * 1.5;
    const sy = Math.sin(a) * r * 1.5;
    const ex = Math.cos(a) * size * 0.4;
    const ey = Math.sin(a) * size * 0.4;
    const perp = a + Math.PI * 0.35;
    const mx = (sx + ex) * 0.5 + Math.cos(perp) * size * 0.1;
    const my = (sy + ey) * 0.5 + Math.sin(perp) * size * 0.1;
    g.moveTo(sx, sy);
    g.quadraticCurveTo(mx, my, ex, ey);
    g.stroke({ color, width: 1.3, alpha: 0.5 });
  }
  // Central source dot
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.9 });
  g.circle(0, 0, r * 1.8);
  g.fill({ color: 0xffffff, alpha: 0.3 });
  c.addChild(g);
}

// ============================================================
// EPISODE 4 - PLANET FORMATION
// ============================================================

// --- Asteroid: jagged polygon with 8 vertices ---
function dAsteroid(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.34;
  const offsets = [0.85, 1.0, 0.75, 0.95, 0.82, 1.0, 0.78, 0.92];
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI * 0.15;
    pts.push({ x: Math.cos(a) * r * offsets[i], y: Math.sin(a) * r * offsets[i] });
  }
  g.poly(pts);
  g.fill({ color, alpha: 0.78 });
  g.poly(pts);
  g.stroke({ color: 0xaaaaaa, width: 1.2, alpha: 0.4 });
  // crater
  g.circle(-r * 0.22, -r * 0.18, r * 0.14);
  g.stroke({ color: 0x888888, width: 1, alpha: 0.35 });
  c.addChild(g);
}

// --- Rocky Planet: circle with surface continent lines ---
function dRockyPlanet(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.36;
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.82 });
  // Continent outline arcs
  g.arc(-r * 0.15, -r * 0.1, r * 0.38, -Math.PI * 0.6, Math.PI * 0.3);
  g.stroke({ color: 0xffffff, width: 1.3, alpha: 0.3 });
  g.arc(r * 0.2, r * 0.25, r * 0.28, Math.PI * 0.1, Math.PI * 0.9);
  g.stroke({ color: 0xffffff, width: 1.1, alpha: 0.25 });
  g.arc(-r * 0.3, r * 0.3, r * 0.2, -Math.PI * 0.4, Math.PI * 0.5);
  g.stroke({ color: 0xffffff, width: 1.0, alpha: 0.2 });
  c.addChild(g);
}

// --- Gas Planet: circle with horizontal bands + small ring ---
function dGasPlanet(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.34;
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.8 });
  // Horizontal band lines (clipped to circle visually via alpha)
  for (const dy of [-r * 0.28, 0, r * 0.28]) {
    g.moveTo(-r * 0.95, dy);
    g.lineTo(r * 0.95, dy);
    g.stroke({ color: 0xffffff, width: 2.2, alpha: 0.18 });
  }
  // Ring (ellipse around planet)
  g.ellipse(0, 0, r * 1.7, r * 0.32);
  g.stroke({ color, width: 2, alpha: 0.45 });
  c.addChild(g);
}

// --- Water: H2O molecule diagram (V-shape) ---
function dWater(c: Container, size: number, color: number) {
  const g = new Graphics();
  const oR = size * 0.15;
  const hR = size * 0.09;
  const bondLen = size * 0.22;
  const angle = Math.PI * 0.52; // ~105 degrees between bonds
  // Bond lines
  g.moveTo(0, 0);
  g.lineTo(Math.cos(-angle) * bondLen, Math.sin(-angle) * bondLen);
  g.stroke({ color, width: 1.5, alpha: 0.55 });
  g.moveTo(0, 0);
  g.lineTo(Math.cos(Math.PI + angle) * bondLen, Math.sin(Math.PI + angle) * bondLen);
  g.stroke({ color, width: 1.5, alpha: 0.55 });
  // O atom (center)
  g.circle(0, 0, oR);
  g.fill({ color, alpha: 0.75 });
  // H atoms
  g.circle(Math.cos(-angle) * bondLen, Math.sin(-angle) * bondLen, hR);
  g.fill({ color: 0xffffff, alpha: 0.6 });
  g.circle(Math.cos(Math.PI + angle) * bondLen, Math.sin(Math.PI + angle) * bondLen, hR);
  g.fill({ color: 0xffffff, alpha: 0.6 });
  c.addChild(g);
  // Labels
  const tO = new Text({ text: 'O', style: new TextStyle({ fontSize: size * 0.13, fill: 0xffffff, fontWeight: 'bold', fontFamily: 'monospace' }) });
  tO.anchor.set(0.5);
  c.addChild(tO);
  const tH1 = new Text({ text: 'H', style: new TextStyle({ fontSize: size * 0.1, fill: 0xddddff, fontWeight: 'bold', fontFamily: 'monospace' }) });
  tH1.anchor.set(0.5);
  tH1.x = Math.cos(-angle) * bondLen;
  tH1.y = Math.sin(-angle) * bondLen;
  c.addChild(tH1);
  const tH2 = new Text({ text: 'H', style: new TextStyle({ fontSize: size * 0.1, fill: 0xddddff, fontWeight: 'bold', fontFamily: 'monospace' }) });
  tH2.anchor.set(0.5);
  tH2.x = Math.cos(Math.PI + angle) * bondLen;
  tH2.y = Math.sin(Math.PI + angle) * bondLen;
  c.addChild(tH2);
}

// --- Atmosphere: 3 concentric outline circles ---
function dAtmosphere(c: Container, size: number, color: number) {
  const g = new Graphics();
  const radii = [size * 0.22, size * 0.30, size * 0.38];
  const alphas = [0.65, 0.38, 0.18];
  for (let i = 0; i < radii.length; i++) {
    g.circle(0, 0, radii[i]);
    g.stroke({ color, width: 1.6, alpha: alphas[i] });
  }
  // planet core
  g.circle(0, 0, size * 0.15);
  g.fill({ color, alpha: 0.7 });
  c.addChild(g);
}

// --- Protoplanetary Disk: central dot + wide flat elliptical ring ---
function dProtoDisk(c: Container, size: number, color: number) {
  const g = new Graphics();
  // Disk layers
  for (let i = 3; i >= 1; i--) {
    g.ellipse(0, 0, size * 0.42 * (1 + i * 0.08), size * 0.1 * (1 + i * 0.05));
    g.stroke({ color, width: 2.0, alpha: 0.15 * i });
  }
  g.ellipse(0, 0, size * 0.44, size * 0.11);
  g.stroke({ color, width: 1.8, alpha: 0.55 });
  // Central protoplanet
  g.circle(0, 0, size * 0.08);
  g.fill({ color, alpha: 0.9 });
  g.circle(0, 0, size * 0.04);
  g.fill({ color: 0xffffff, alpha: 0.7 });
  c.addChild(g);
}

// --- Moon: circle with crescent shadow ---
function dMoon(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.34;
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.8 });
  // Crescent shadow: offset dark circle overlaid
  g.circle(r * 0.28, 0, r * 0.82);
  g.fill({ color: 0x111122, alpha: 0.72 });
  c.addChild(g);
}

// --- Ocean: 3 wavy sine lines ---
function dOcean(c: Container, size: number, color: number) {
  const g = new Graphics();
  const w = size * 0.4;
  const offsets = [-size * 0.12, 0, size * 0.12];
  for (const dy of offsets) {
    const steps = 20;
    g.moveTo(-w, dy);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = -w + t * w * 2;
      const y = dy + Math.sin(t * Math.PI * 3) * size * 0.055;
      g.lineTo(x, y);
    }
    g.stroke({ color, width: 1.8, alpha: 0.55 });
  }
  c.addChild(g);
}

// ============================================================
// EPISODE 5 - ORIGIN OF LIFE
// ============================================================

// --- Amino Acid: central carbon with 3 branches (NH2, COOH, R) ---
function dAminoAcid(c: Container, size: number, color: number) {
  const g = new Graphics();
  const bondLen = size * 0.25;
  const arms = [
    { a: -Math.PI / 2, label: 'NH2' },
    { a: Math.PI / 6, label: 'COOH' },
    { a: Math.PI * 5 / 6, label: 'R' },
  ];
  for (const arm of arms) {
    g.moveTo(0, 0);
    g.lineTo(Math.cos(arm.a) * bondLen, Math.sin(arm.a) * bondLen);
    g.stroke({ color, width: 1.5, alpha: 0.6 });
    g.circle(Math.cos(arm.a) * bondLen, Math.sin(arm.a) * bondLen, size * 0.07);
    g.fill({ color, alpha: 0.45 });
  }
  // Central carbon
  g.circle(0, 0, size * 0.08);
  g.fill({ color, alpha: 0.85 });
  c.addChild(g);
  const labels = arms.map(arm => arm.label);
  for (let i = 0; i < arms.length; i++) {
    const t = new Text({ text: labels[i], style: new TextStyle({ fontSize: size * 0.09, fill: 0xdddddd, fontFamily: 'monospace' }) });
    t.anchor.set(0.5);
    t.x = Math.cos(arms[i].a) * bondLen * 1.55;
    t.y = Math.sin(arms[i].a) * bondLen * 1.55;
    c.addChild(t);
  }
}

// --- Lipid: circle head + 2 wavy tail lines ---
function dLipid(c: Container, size: number, color: number) {
  const g = new Graphics();
  const headR = size * 0.12;
  const headY = -size * 0.24;
  g.circle(0, headY, headR);
  g.fill({ color, alpha: 0.82 });
  g.circle(0, headY, headR);
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.35 });
  // 2 wavy tail lines
  for (const dx of [-size * 0.06, size * 0.06]) {
    const steps = 14;
    const startY = headY + headR;
    const endY = size * 0.34;
    g.moveTo(dx, startY);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = dx + Math.sin(t * Math.PI * 3) * size * 0.055;
      const y = startY + t * (endY - startY);
      g.lineTo(x, y);
    }
    g.stroke({ color, width: 1.4, alpha: 0.6 });
  }
  c.addChild(g);
}

// --- RNA: single-strand zigzag line ---
function dRna(c: Container, size: number, color: number) {
  const g = new Graphics();
  const h = size * 0.38;
  const w = size * 0.14;
  const steps = 10;
  g.moveTo(0, -h);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = (i % 2 === 0 ? -w : w);
    const y = -h + t * h * 2;
    g.lineTo(x, y);
  }
  g.stroke({ color, width: 2, alpha: 0.75 });
  // Rung bases (short horizontal ticks)
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const x = (i % 2 === 0 ? -w : w);
    const y = -h + t * h * 2;
    g.moveTo(x, y);
    g.lineTo(x + (i % 2 === 0 ? w * 0.8 : -w * 0.8), y);
    g.stroke({ color, width: 1, alpha: 0.35 });
  }
  c.addChild(g);
}

// --- DNA: double helix with rungs ---
function dDna(c: Container, size: number, color: number) {
  const g = new Graphics();
  const h = size * 0.38;
  const w = size * 0.16;
  const steps = 16;
  // Two sine waves
  for (let strand = 0; strand < 2; strand++) {
    const phase = strand * Math.PI;
    g.moveTo(Math.sin(phase) * w, -h);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const a = t * Math.PI * 3 + phase;
      g.lineTo(Math.sin(a) * w, -h + t * h * 2);
    }
    g.stroke({ color, width: 1.8, alpha: 0.7 });
  }
  // Rungs connecting the strands
  for (let i = 1; i < steps; i += 2) {
    const t = i / steps;
    const y = -h + t * h * 2;
    const a1 = t * Math.PI * 3;
    const a2 = t * Math.PI * 3 + Math.PI;
    g.moveTo(Math.sin(a1) * w, y);
    g.lineTo(Math.sin(a2) * w, y);
    g.stroke({ color: 0xffffff, width: 1, alpha: 0.3 });
  }
  c.addChild(g);
}

// --- Protein: meandering folded chain ---
function dProtein(c: Container, size: number, color: number) {
  const g = new Graphics();
  const pts = [
    [-0.35, -0.35], [0.1, -0.38], [0.38, -0.1],
    [0.2, 0.25], [-0.15, 0.38], [-0.38, 0.1],
    [-0.1, -0.15], [0.18, 0.0], [0.3, 0.32],
  ].map(([x, y]) => ({ x: x * size, y: y * size }));
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    g.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  g.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  g.stroke({ color, width: 2.5, alpha: 0.75 });
  // Node dots at each control point
  for (const p of pts) {
    g.circle(p.x, p.y, size * 0.035);
    g.fill({ color, alpha: 0.55 });
  }
  c.addChild(g);
}

// --- Cell: membrane outline + nucleus + organelle dots ---
function dCell(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.36;
  // Cell membrane
  g.circle(0, 0, r);
  g.stroke({ color, width: 1.8, alpha: 0.7 });
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.1 });
  // Nucleus
  g.circle(-r * 0.15, -r * 0.1, r * 0.28);
  g.fill({ color, alpha: 0.3 });
  g.circle(-r * 0.15, -r * 0.1, r * 0.28);
  g.stroke({ color, width: 1.2, alpha: 0.55 });
  // Organelle dots
  const organelles = [[r * 0.3, r * 0.2], [r * 0.15, r * 0.32], [-r * 0.1, r * 0.3], [r * 0.35, -r * 0.2]];
  for (const [ox, oy] of organelles) {
    g.circle(ox, oy, r * 0.07);
    g.fill({ color, alpha: 0.4 });
  }
  c.addChild(g);
}

// --- Photosynthesis: leaf shape + sun star ---
function dPhotosynthesis(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Leaf (pointed oval)
  g.moveTo(0, -s);
  g.bezierCurveTo(s * 0.65, -s * 0.5, s * 0.65, s * 0.5, 0, s);
  g.bezierCurveTo(-s * 0.65, s * 0.5, -s * 0.65, -s * 0.5, 0, -s);
  g.fill({ color, alpha: 0.7 });
  // Midrib line
  g.moveTo(0, -s * 0.85);
  g.lineTo(0, s * 0.85);
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.3 });
  // Sun star in upper corner
  const sr = s * 0.22;
  const sx = s * 0.55;
  const sy = -s * 0.6;
  const sunPts: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? sr : sr * 0.45;
    sunPts.push({ x: sx + Math.cos(a) * rad, y: sy + Math.sin(a) * rad });
  }
  g.poly(sunPts);
  g.fill({ color: 0xffee44, alpha: 0.85 });
  c.addChild(g);
}

// --- Mitochondria: oval outline with zigzag cristae ---
function dMitochondria(c: Container, size: number, color: number) {
  const g = new Graphics();
  const rx = size * 0.38;
  const ry = size * 0.2;
  // Outer membrane
  g.ellipse(0, 0, rx, ry);
  g.stroke({ color, width: 1.8, alpha: 0.75 });
  g.ellipse(0, 0, rx, ry);
  g.fill({ color, alpha: 0.12 });
  // Inner membrane zigzag (cristae)
  const steps = 7;
  const xStart = -rx * 0.75;
  const xEnd = rx * 0.75;
  g.moveTo(xStart, 0);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = xStart + t * (xEnd - xStart);
    const y = (i % 2 === 0 ? -ry * 0.52 : ry * 0.52);
    g.lineTo(x, y);
  }
  g.stroke({ color, width: 1.3, alpha: 0.5 });
  c.addChild(g);
}

// --- Multicellular: cluster of 5 overlapping circles ---
function dMulticellular(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.18;
  const positions = [
    [0, -size * 0.16], [-size * 0.18, size * 0.08],
    [size * 0.18, size * 0.08], [-size * 0.08, size * 0.24],
    [size * 0.08, size * 0.24],
  ];
  for (const [x, y] of positions) {
    g.circle(x, y, r);
    g.fill({ color, alpha: 0.35 });
    g.circle(x, y, r);
    g.stroke({ color, width: 1.3, alpha: 0.65 });
  }
  c.addChild(g);
}

// --- Virus: hexagonal capsid with spike protrusions ---
function dVirus(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.24;
  const spikeLen = size * 0.1;
  // Hexagonal capsid
  const hex: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    hex.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  g.poly(hex);
  g.fill({ color, alpha: 0.65 });
  g.poly(hex);
  g.stroke({ color, width: 1.5, alpha: 0.5 });
  // Spikes at each vertex
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const vx = Math.cos(a) * r;
    const vy = Math.sin(a) * r;
    g.moveTo(vx, vy);
    g.lineTo(Math.cos(a) * (r + spikeLen), Math.sin(a) * (r + spikeLen));
    g.stroke({ color, width: 1.5, alpha: 0.7 });
    g.circle(Math.cos(a) * (r + spikeLen), Math.sin(a) * (r + spikeLen), size * 0.03);
    g.fill({ color, alpha: 0.8 });
  }
  c.addChild(g);
}

// ============================================================
// EPISODE 6 - CIVILIZATION
// ============================================================

// --- Neuron: central body + branching dendrites ---
function dNeuron(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.12;
  const branches = [
    { a: -Math.PI / 2, len: 0.38, split: 0.6 },
    { a: Math.PI / 6, len: 0.32, split: 0.55 },
    { a: Math.PI * 5 / 6, len: 0.32, split: 0.55 },
    { a: Math.PI * 1.1, len: 0.24, split: 0 },
  ];
  for (const b of branches) {
    const ex = Math.cos(b.a) * size * b.len;
    const ey = Math.sin(b.a) * size * b.len;
    g.moveTo(Math.cos(b.a) * r, Math.sin(b.a) * r);
    g.lineTo(ex, ey);
    g.stroke({ color, width: 1.3, alpha: 0.55 });
    if (b.split > 0) {
      const mx = Math.cos(b.a) * size * b.len * b.split;
      const my = Math.sin(b.a) * size * b.len * b.split;
      const a2 = b.a - 0.4;
      g.moveTo(mx, my);
      g.lineTo(mx + Math.cos(a2) * size * 0.14, my + Math.sin(a2) * size * 0.14);
      g.stroke({ color, width: 1, alpha: 0.4 });
    }
  }
  // Soma (cell body)
  g.circle(0, 0, r);
  g.fill({ color, alpha: 0.85 });
  g.circle(0, 0, r * 1.6);
  g.fill({ color, alpha: 0.2 });
  c.addChild(g);
}

// --- Brain: two bumpy hemispheres side by side ---
function dBrain(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Left hemisphere
  g.moveTo(0, -s * 0.2);
  g.bezierCurveTo(-s * 0.2, -s, -s, -s * 0.8, -s, 0);
  g.bezierCurveTo(-s, s * 0.6, -s * 0.3, s * 0.7, 0, s * 0.45);
  g.fill({ color, alpha: 0.7 });
  g.moveTo(0, -s * 0.2);
  g.bezierCurveTo(-s * 0.2, -s, -s, -s * 0.8, -s, 0);
  g.bezierCurveTo(-s, s * 0.6, -s * 0.3, s * 0.7, 0, s * 0.45);
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.3 });
  // Right hemisphere
  g.moveTo(0, -s * 0.2);
  g.bezierCurveTo(s * 0.2, -s, s, -s * 0.8, s, 0);
  g.bezierCurveTo(s, s * 0.6, s * 0.3, s * 0.7, 0, s * 0.45);
  g.fill({ color, alpha: 0.7 });
  g.moveTo(0, -s * 0.2);
  g.bezierCurveTo(s * 0.2, -s, s, -s * 0.8, s, 0);
  g.bezierCurveTo(s, s * 0.6, s * 0.3, s * 0.7, 0, s * 0.45);
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.3 });
  // Gyri (bumpy lines on surface)
  for (const side of [-1, 1]) {
    g.arc(side * s * 0.5, -s * 0.2, s * 0.28, Math.PI * 0.3, Math.PI * 0.95);
    g.stroke({ color: 0xffffff, width: 1, alpha: 0.2 });
    g.arc(side * s * 0.35, s * 0.15, s * 0.22, -Math.PI * 0.2, Math.PI * 0.65);
    g.stroke({ color: 0xffffff, width: 1, alpha: 0.18 });
  }
  c.addChild(g);
}

// --- Intelligence: lightbulb shape ---
function dIntelligence(c: Container, size: number, color: number) {
  const g = new Graphics();
  const r = size * 0.28;
  const baseY = size * 0.18;
  // Bulb circle (upper)
  g.arc(0, -size * 0.06, r, Math.PI * 0.15, Math.PI * 0.85, true);
  g.fill({ color, alpha: 0.75 });
  g.arc(0, -size * 0.06, r, Math.PI * 0.15, Math.PI * 0.85, true);
  g.stroke({ color, width: 1.5, alpha: 0.5 });
  // Base trapezoid
  const bw = r * 0.55;
  g.poly([
    { x: -bw, y: baseY - size * 0.02 },
    { x: bw, y: baseY - size * 0.02 },
    { x: bw * 0.7, y: baseY + size * 0.12 },
    { x: -bw * 0.7, y: baseY + size * 0.12 },
  ]);
  g.fill({ color, alpha: 0.55 });
  // Filament lines
  g.moveTo(-bw * 0.5, baseY);
  g.lineTo(-bw * 0.2, baseY - size * 0.08);
  g.lineTo(bw * 0.2, baseY - size * 0.08);
  g.lineTo(bw * 0.5, baseY);
  g.stroke({ color: 0xffee88, width: 1.2, alpha: 0.55 });
  // Glow
  g.circle(0, -size * 0.06, r * 0.35);
  g.fill({ color: 0xffffaa, alpha: 0.35 });
  c.addChild(g);
}

// --- Language: speech bubble ---
function dLanguage(c: Container, size: number, color: number) {
  const g = new Graphics();
  const w = size * 0.36;
  const h = size * 0.26;
  const cr = size * 0.06;
  const top = -size * 0.18;
  const bot = top + h;
  // Rounded rect bubble
  g.moveTo(-w + cr, top);
  g.lineTo(w - cr, top);
  g.arc(w - cr, top + cr, cr, -Math.PI / 2, 0);
  g.lineTo(w, bot - cr);
  g.arc(w - cr, bot - cr, cr, 0, Math.PI / 2);
  g.lineTo(w * 0.15 + cr, bot);
  g.lineTo(w * 0.15, bot + size * 0.14); // pointer tip
  g.lineTo(w * 0.15 - cr, bot);
  g.lineTo(-w + cr, bot);
  g.arc(-w + cr, bot - cr, cr, Math.PI / 2, Math.PI);
  g.lineTo(-w, top + cr);
  g.arc(-w + cr, top + cr, cr, Math.PI, -Math.PI / 2);
  g.closePath();
  g.fill({ color, alpha: 0.7 });
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.3 });
  // Text lines inside bubble
  for (const dy of [top + h * 0.3, top + h * 0.65]) {
    g.moveTo(-w * 0.55, dy);
    g.lineTo(w * 0.55, dy);
    g.stroke({ color: 0xffffff, width: 1.3, alpha: 0.35 });
  }
  c.addChild(g);
}

// --- Civilization: 3 rectangle buildings ---
function dCivilization(c: Container, size: number, color: number) {
  const g = new Graphics();
  const groundY = size * 0.35;
  const buildings = [
    { x: -size * 0.22, w: size * 0.16, h: size * 0.38 },
    { x: 0,            w: size * 0.18, h: size * 0.55 },
    { x: size * 0.22,  w: size * 0.15, h: size * 0.28 },
  ];
  for (const b of buildings) {
    g.rect(b.x - b.w / 2, groundY - b.h, b.w, b.h);
    g.fill({ color, alpha: 0.65 });
    g.rect(b.x - b.w / 2, groundY - b.h, b.w, b.h);
    g.stroke({ color: 0xffffff, width: 1, alpha: 0.25 });
    // Windows
    for (let row = 1; row <= 3; row++) {
      for (let col = 0; col < 2; col++) {
        g.rect(
          b.x - b.w * 0.3 + col * b.w * 0.4,
          groundY - b.h + row * b.h * 0.22,
          b.w * 0.2, b.h * 0.1
        );
        g.fill({ color: 0xffffcc, alpha: 0.4 });
      }
    }
  }
  // Ground line
  g.moveTo(-size * 0.42, groundY);
  g.lineTo(size * 0.42, groundY);
  g.stroke({ color, width: 1.5, alpha: 0.4 });
  c.addChild(g);
}

// --- Science: beaker/flask shape ---
function dScience(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Flask neck (narrow rectangle)
  const neckW = s * 0.22;
  const neckTop = -s;
  const neckBot = -s * 0.28;
  g.rect(-neckW, neckTop, neckW * 2, neckBot - neckTop);
  g.fill({ color, alpha: 0.55 });
  g.rect(-neckW, neckTop, neckW * 2, neckBot - neckTop);
  g.stroke({ color, width: 1.4, alpha: 0.6 });
  // Flask body (triangle-ish)
  g.poly([
    { x: -neckW, y: neckBot },
    { x: neckW, y: neckBot },
    { x: s * 0.75, y: s * 0.65 },
    { x: -s * 0.75, y: s * 0.65 },
  ]);
  g.fill({ color, alpha: 0.4 });
  g.poly([
    { x: -neckW, y: neckBot },
    { x: neckW, y: neckBot },
    { x: s * 0.75, y: s * 0.65 },
    { x: -s * 0.75, y: s * 0.65 },
  ]);
  g.stroke({ color, width: 1.4, alpha: 0.65 });
  // Liquid level
  g.poly([
    { x: -s * 0.65, y: s * 0.3 },
    { x: s * 0.65, y: s * 0.3 },
    { x: s * 0.75, y: s * 0.65 },
    { x: -s * 0.75, y: s * 0.65 },
  ]);
  g.fill({ color, alpha: 0.45 });
  // Bubbles in liquid
  for (const [bx, by] of [[-s * 0.2, s * 0.48], [s * 0.22, s * 0.54], [0, s * 0.42]]) {
    g.circle(bx, by, s * 0.06);
    g.stroke({ color: 0xffffff, width: 1, alpha: 0.4 });
  }
  // Rim at top of neck
  g.moveTo(-neckW * 1.3, neckTop);
  g.lineTo(neckW * 1.3, neckTop);
  g.stroke({ color, width: 2, alpha: 0.55 });
  c.addChild(g);
}

// --- Telescope: angled tube (trapezoid) with lens circles at ends ---
function dTelescope(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Tube body (angled trapezoid)
  const angle = -Math.PI / 7;
  const len = s * 1.7;
  const wx = Math.cos(angle + Math.PI / 2);
  const wy = Math.sin(angle + Math.PI / 2);
  const dx = Math.cos(angle) * len;
  const dy = Math.sin(angle) * len;
  const wideHalf = s * 0.17;
  const narrowHalf = s * 0.1;
  // Objective end (wide)
  const ox = -dx * 0.5;
  const oy = -dy * 0.5;
  // Eyepiece end (narrow)
  const ex = dx * 0.5;
  const ey = dy * 0.5;
  g.poly([
    { x: ox + wx * wideHalf, y: oy + wy * wideHalf },
    { x: ox - wx * wideHalf, y: oy - wy * wideHalf },
    { x: ex - wx * narrowHalf, y: ey - wy * narrowHalf },
    { x: ex + wx * narrowHalf, y: ey + wy * narrowHalf },
  ]);
  g.fill({ color, alpha: 0.7 });
  g.poly([
    { x: ox + wx * wideHalf, y: oy + wy * wideHalf },
    { x: ox - wx * wideHalf, y: oy - wy * wideHalf },
    { x: ex - wx * narrowHalf, y: ey - wy * narrowHalf },
    { x: ex + wx * narrowHalf, y: ey + wy * narrowHalf },
  ]);
  g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.3 });
  // Objective lens circle
  g.circle(ox, oy, wideHalf * 1.15);
  g.stroke({ color, width: 1.8, alpha: 0.7 });
  // Eyepiece lens circle
  g.circle(ex, ey, narrowHalf * 1.2);
  g.stroke({ color, width: 1.5, alpha: 0.6 });
  // Tripod legs
  const baseX = ox + wy * wideHalf * 0.6;
  const baseY = oy - wx * wideHalf * 0.6;
  for (const legA of [Math.PI * 0.5, Math.PI * 0.7, Math.PI * 0.3]) {
    g.moveTo(baseX, baseY);
    g.lineTo(baseX + Math.cos(legA) * s * 0.4, baseY + Math.sin(legA) * s * 0.4);
    g.stroke({ color, width: 1.2, alpha: 0.5 });
  }
  c.addChild(g);
}

// --- Spaceship: rocket with nose, body, fins, and flame ---
function dSpaceship(c: Container, size: number, color: number) {
  const g = new Graphics();
  const s = size * 0.38;
  // Body (rectangle)
  const bw = s * 0.28;
  const bTop = -s * 0.22;
  const bBot = s * 0.42;
  g.rect(-bw, bTop, bw * 2, bBot - bTop);
  g.fill({ color, alpha: 0.8 });
  g.rect(-bw, bTop, bw * 2, bBot - bTop);
  g.stroke({ color: 0xffffff, width: 1, alpha: 0.25 });
  // Nose cone (triangle)
  g.poly([
    { x: 0, y: -s },
    { x: -bw, y: bTop },
    { x: bw, y: bTop },
  ]);
  g.fill({ color, alpha: 0.9 });
  // Fins (left and right)
  g.poly([
    { x: -bw, y: bBot - s * 0.28 },
    { x: -bw * 2.2, y: bBot },
    { x: -bw, y: bBot },
  ]);
  g.fill({ color, alpha: 0.75 });
  g.poly([
    { x: bw, y: bBot - s * 0.28 },
    { x: bw * 2.2, y: bBot },
    { x: bw, y: bBot },
  ]);
  g.fill({ color, alpha: 0.75 });
  // Window
  g.circle(0, bTop + s * 0.28, bw * 0.38);
  g.fill({ color: 0x88ddff, alpha: 0.5 });
  g.circle(0, bTop + s * 0.28, bw * 0.38);
  g.stroke({ color: 0xffffff, width: 1, alpha: 0.4 });
  // Flame
  g.moveTo(-bw * 0.55, bBot);
  g.bezierCurveTo(-bw * 0.4, bBot + s * 0.35, -bw * 0.1, bBot + s * 0.55, 0, bBot + s * 0.6);
  g.bezierCurveTo(bw * 0.1, bBot + s * 0.55, bw * 0.4, bBot + s * 0.35, bw * 0.55, bBot);
  g.fill({ color: 0xff8800, alpha: 0.85 });
  // Flame inner
  g.moveTo(-bw * 0.28, bBot);
  g.bezierCurveTo(-bw * 0.18, bBot + s * 0.25, 0, bBot + s * 0.4, 0, bBot + s * 0.42);
  g.bezierCurveTo(0, bBot + s * 0.4, bw * 0.18, bBot + s * 0.25, bw * 0.28, bBot);
  g.fill({ color: 0xffee44, alpha: 0.7 });
  c.addChild(g);
}
