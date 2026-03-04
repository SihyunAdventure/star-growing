import { Container, Graphics, Text, TextStyle, FillGradient } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from '../game/GameState';
import { hexToRgba } from './Panel';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';

export class WinScreen {
  container: Container;
  private gameState: GameState;

  // Callbacks
  onRestart?: () => void;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();
    this.container.visible = false;
  }

  show(): void {
    this.container.visible = true;
    this.buildScreen();
  }

  private buildScreen(): void {
    // Clear previous
    while (this.container.children.length > 0) {
      this.container.removeChildAt(0);
    }

    // Dark overlay
    const overlay = new Graphics();
    overlay.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    overlay.fill({ color: 0x000000, alpha: 0.85 });
    overlay.eventMode = 'static';
    this.container.addChild(overlay);

    overlay.alpha = 0;
    gsap.to(overlay, { alpha: 1, duration: 0.5 });

    // Central card
    const card = new Container();
    card.x = GAME_WIDTH / 2;
    card.y = GAME_HEIGHT / 2 - 40;
    this.container.addChild(card);

    const cardW = 320;
    const cardH = 400;

    // Glow effect
    for (let i = 5; i > 0; i--) {
      const pad = i * 12;
      const glow = new Graphics();
      glow.roundRect(-cardW / 2 - pad, -cardH / 2 - pad, cardW + pad * 2, cardH + pad * 2, 24 + pad);
      glow.fill({ color: 0xFFD740, alpha: 0.02 * (6 - i) });
      card.addChild(glow);
    }

    // Card background
    const cardBg = new Graphics();
    const grad = new FillGradient({
      type: 'linear', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 },
      colorStops: [
        { offset: 0, color: hexToRgba(0x1a1a5e, 0.95) },
        { offset: 1, color: hexToRgba(0x0d0d35, 0.95) },
      ],
    });
    cardBg.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 24);
    cardBg.fill(grad);
    cardBg.stroke({ color: 0xFFD740, width: 2, alpha: 0.8 });
    card.addChild(cardBg);

    // Rocket icon (procedural)
    const rocket = new Graphics();
    // Body
    rocket.moveTo(0, -40);
    rocket.lineTo(12, -10);
    rocket.lineTo(12, 20);
    rocket.lineTo(-12, 20);
    rocket.lineTo(-12, -10);
    rocket.closePath();
    rocket.fill({ color: 0xffffff, alpha: 0.9 });
    // Nose cone
    rocket.moveTo(0, -55);
    rocket.lineTo(12, -40);
    rocket.lineTo(-12, -40);
    rocket.closePath();
    rocket.fill({ color: 0xFFD740, alpha: 0.9 });
    // Fins
    rocket.moveTo(-12, 20);
    rocket.lineTo(-22, 32);
    rocket.lineTo(-12, 10);
    rocket.closePath();
    rocket.fill({ color: 0xFF6B35, alpha: 0.8 });
    rocket.moveTo(12, 20);
    rocket.lineTo(22, 32);
    rocket.lineTo(12, 10);
    rocket.closePath();
    rocket.fill({ color: 0xFF6B35, alpha: 0.8 });
    // Flame
    rocket.moveTo(-8, 22);
    rocket.lineTo(0, 45);
    rocket.lineTo(8, 22);
    rocket.closePath();
    rocket.fill({ color: 0xFF4444, alpha: 0.7 });
    rocket.moveTo(-5, 22);
    rocket.lineTo(0, 38);
    rocket.lineTo(5, 22);
    rocket.closePath();
    rocket.fill({ color: 0xFFD740, alpha: 0.9 });
    rocket.y = -cardH / 2 + 90;
    card.addChild(rocket);

    // Title
    const title = new Text({
      text: '우주의 여정을 완료했습니다!',
      style: new TextStyle({
        fontSize: 18, fill: 0xFFD740, fontWeight: 'bold', letterSpacing: 1,
        wordWrap: true, wordWrapWidth: cardW - 40, align: 'center',
      }),
    });
    title.anchor.set(0.5);
    title.y = -cardH / 2 + 165;
    card.addChild(title);

    // Subtitle
    const subtitle = new Text({
      text: '별에서 태어나 별로 돌아가는 여정',
      style: new TextStyle({ fontSize: 13, fill: 0xaaaacc }),
    });
    subtitle.anchor.set(0.5);
    subtitle.y = -cardH / 2 + 195;
    card.addChild(subtitle);

    // Divider
    const divider = new Graphics();
    divider.rect(-cardW / 2 + 30, -cardH / 2 + 220, cardW - 60, 1);
    divider.fill({ color: 0x4488ff, alpha: 0.3 });
    card.addChild(divider);

    // Stats
    const stats = [
      { label: '합성 횟수', value: `${this.gameState.totalMerges}` },
      { label: '발견 아이템', value: `${this.gameState.discoveredItems.size}/48` },
      { label: '발견 레시피', value: `${this.gameState.discoveredRecipes.length}/52` },
    ];

    let statY = -cardH / 2 + 240;
    for (const stat of stats) {
      const labelText = new Text({
        text: stat.label,
        style: new TextStyle({ fontSize: 12, fill: 0x8888aa }),
      });
      labelText.x = -cardW / 2 + 40;
      labelText.y = statY;
      card.addChild(labelText);

      const valueText = new Text({
        text: stat.value,
        style: new TextStyle({ fontSize: 14, fill: 0xffffff, fontWeight: 'bold' }),
      });
      valueText.anchor.set(1, 0);
      valueText.x = cardW / 2 - 40;
      valueText.y = statY;
      card.addChild(valueText);

      statY += 28;
    }

    // Restart button
    const restartBtn = new Container();
    restartBtn.y = cardH / 2 - 50;
    card.addChild(restartBtn);

    const btnW = 180;
    const btnH = 40;
    const btnBg = new Graphics();
    btnBg.roundRect(-btnW / 2, -btnH / 2, btnW, btnH, 20);
    btnBg.fill({ color: 0x1a4e2a, alpha: 0.9 });
    btnBg.stroke({ color: 0x66BB6A, width: 2, alpha: 0.8 });
    restartBtn.addChild(btnBg);

    const btnText = new Text({
      text: '처음부터 다시',
      style: new TextStyle({ fontSize: 14, fill: 0x66BB6A, fontWeight: 'bold' }),
    });
    btnText.anchor.set(0.5);
    restartBtn.addChild(btnText);

    btnBg.eventMode = 'static';
    btnBg.cursor = 'pointer';
    btnBg.on('pointertap', () => {
      this.onRestart?.();
    });

    // Animate card in
    card.scale.set(0);
    gsap.to(card.scale, { x: 1, y: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', delay: 0.3 });

    // Floating rocket animation
    gsap.to(rocket, { y: rocket.y - 5, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
}
