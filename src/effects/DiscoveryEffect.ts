import { Container, Graphics, Text, TextStyle, FillGradient } from 'pixi.js';
import gsap from 'gsap';
import { getItemDef } from '../data/items';
import { hexToRgba } from '../ui/Panel';
import { createItemIcon } from '../ui/ItemRenderer';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';

export class DiscoveryEffect {
  static show(parent: Container, itemId: string): void {
    const def = getItemDef(itemId);
    if (!def) return;

    const overlay = new Container();
    overlay.eventMode = 'static';
    parent.addChild(overlay);

    // Dark overlay
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    bg.fill({ color: 0x000000, alpha: 0.75 });
    bg.alpha = 0;
    overlay.addChild(bg);
    gsap.to(bg, { alpha: 1, duration: 0.3 });

    // Card
    const card = new Container();
    card.x = GAME_WIDTH / 2;
    card.y = GAME_HEIGHT / 2;
    card.scale.set(0);
    overlay.addChild(card);

    const cardW = 260;
    const cardH = 240;

    // Glow
    for (let i = 5; i > 0; i--) {
      const pad = i * 8;
      const glow = new Graphics();
      glow.roundRect(-cardW / 2 - pad, -cardH / 2 - pad, cardW + pad * 2, cardH + pad * 2, 20 + pad);
      glow.fill({ color: def.color, alpha: 0.03 * (6 - i) });
      card.addChild(glow);
    }

    // Card bg
    const cardBg = new Graphics();
    const grad = new FillGradient({
      type: 'linear', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 },
      colorStops: [
        { offset: 0, color: hexToRgba(0x1a1a5e, 0.95) },
        { offset: 1, color: hexToRgba(0x0d0d35, 0.95) },
      ],
    });
    cardBg.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
    cardBg.fill(grad);
    cardBg.stroke({ color: def.color, width: 2, alpha: 0.8 });
    card.addChild(cardBg);

    // "새로운 발견!" label
    const label = new Text({
      text: '새로운 발견!',
      style: new TextStyle({ fontSize: 14, fill: 0x80CBC4, fontWeight: 'bold', letterSpacing: 2 }),
    });
    label.anchor.set(0.5);
    label.y = -cardH / 2 + 30;
    card.addChild(label);

    // Custom drawn icon (replaces emoji)
    const icon = createItemIcon(itemId, 80, def.color);
    icon.y = -20;
    card.addChild(icon);

    // Item name
    const name = new Text({
      text: def.name,
      style: new TextStyle({ fontSize: 18, fill: 0xffffff, fontWeight: 'bold' }),
    });
    name.anchor.set(0.5);
    name.y = 35;
    card.addChild(name);

    // Science fact
    const fact = new Text({
      text: def.scienceFact,
      style: new TextStyle({
        fontSize: 12, fill: 0xaaaacc, wordWrap: true, wordWrapWidth: cardW - 40, align: 'center',
      }),
    });
    fact.anchor.set(0.5);
    fact.y = 65;
    card.addChild(fact);

    // Hint
    const hint = new Text({
      text: '탭하여 닫기',
      style: new TextStyle({ fontSize: 11, fill: 0x666688 }),
    });
    hint.anchor.set(0.5);
    hint.y = cardH / 2 - 20;
    card.addChild(hint);

    // Animate
    gsap.to(card.scale, { x: 1, y: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: 0.15 });

    // Close on tap
    const close = () => {
      gsap.to(card.scale, { x: 0, y: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(bg, {
        alpha: 0, duration: 0.2,
        onComplete: () => { parent.removeChild(overlay); overlay.destroy({ children: true }); },
      });
    };
    bg.eventMode = 'static';
    bg.cursor = 'pointer';
    bg.on('pointertap', close);
    cardBg.eventMode = 'static';
    cardBg.on('pointertap', close);
  }
}
