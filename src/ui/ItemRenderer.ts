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
