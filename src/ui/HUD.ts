import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from '../game/GameState';
import { getItemDef } from '../data/items';
import { Panel } from './Panel';

const GAME_WIDTH = 390;

interface ResourcePill {
  container: Container;
  valueText: Text;
}

export class HUD {
  container: Container;
  private stardustPill: ResourcePill;
  private cosmicPill: ResourcePill;
  private discoveryPill: ResourcePill;
  private productionPill: ResourcePill;
  private gameState: GameState;
  private notifContainer: Container;
  private discoveryLog: Text;
  private recentDiscoveries: string[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();

    // Header panel (glassmorphism)
    const header = new Panel({
      width: GAME_WIDTH,
      height: 65,
      radius: 0,
      gradient: true,
      gradientFrom: 0x0d0d40,
      gradientTo: 0x08082a,
      fillAlpha: 0.92,
      strokeColor: 0x2a2a6e,
      strokeWidth: 0,
      strokeAlpha: 0,
    });
    this.container.addChild(header);

    // Bottom border glow
    const borderLine = new Graphics();
    borderLine.rect(0, 64, GAME_WIDTH, 1);
    borderLine.fill({ color: 0x2a2a8e, alpha: 0.5 });
    this.container.addChild(borderLine);

    // Title
    const title = new Text({
      text: '⭐ 별 키우기',
      style: new TextStyle({ fontSize: 20, fill: 0xffffff, fontWeight: 'bold' }),
    });
    title.x = 15;
    title.y = 8;
    this.container.addChild(title);

    // Resource pills
    this.stardustPill = this.createPill(12, 38, 0xFFD700, '✦ 0');
    this.cosmicPill = this.createPill(108, 38, 0xBB86FC, '🔮 0');
    this.discoveryPill = this.createPill(204, 38, 0x80CBC4, '📖 2/48');
    this.productionPill = this.createPill(305, 38, 0xFFAB40, '⚡ 0/초');

    // Discovery notification area
    const notifPanel = new Panel({
      width: GAME_WIDTH,
      height: 105,
      radius: 0,
      fillColor: 0x08082a,
      fillAlpha: 0.5,
      strokeWidth: 0,
      strokeAlpha: 0,
    });
    notifPanel.y = 65;
    this.container.addChild(notifPanel);

    // Discovery log
    const logLabel = new Text({
      text: '최근 발견:',
      style: new TextStyle({ fontSize: 12, fill: 0x888899 }),
    });
    logLabel.x = 15;
    logLabel.y = 73;
    this.container.addChild(logLabel);

    this.discoveryLog = new Text({
      text: '',
      style: new TextStyle({ fontSize: 12, fill: 0xaaaacc, wordWrap: true, wordWrapWidth: GAME_WIDTH - 30 }),
    });
    this.discoveryLog.x = 15;
    this.discoveryLog.y = 92;
    this.container.addChild(this.discoveryLog);

    // Notification overlay (for slide-in)
    this.notifContainer = new Container();
    this.notifContainer.y = 65;
    this.container.addChild(this.notifContainer);
  }

  private createPill(x: number, y: number, color: number, initialText: string): ResourcePill {
    const pill = new Container();
    pill.x = x;
    pill.y = y;

    const bg = new Graphics();
    bg.roundRect(0, 0, 88, 22, 11);
    bg.fill({ color, alpha: 0.12 });
    bg.stroke({ color, width: 1, alpha: 0.3 });
    pill.addChild(bg);

    const text = new Text({
      text: initialText,
      style: new TextStyle({ fontSize: 13, fill: color, fontWeight: 'bold' }),
    });
    text.x = 8;
    text.y = 2;
    pill.addChild(text);

    this.container.addChild(pill);
    return { container: pill, valueText: text };
  }

  onNewDiscovery(itemId: string): void {
    const def = getItemDef(itemId);
    if (!def) return;

    const entry = `${def.emoji} ${def.name} — ${def.scienceFact}`;
    this.recentDiscoveries.unshift(entry);
    if (this.recentDiscoveries.length > 3) this.recentDiscoveries.pop();
    this.discoveryLog.text = this.recentDiscoveries.join('\n');

    // Slide-in notification
    this.showNotification(def.emoji, def.name);
  }

  private showNotification(emoji: string, name: string): void {
    const notif = new Container();
    notif.x = GAME_WIDTH;
    notif.y = 4;

    const bg = new Graphics();
    bg.roundRect(0, 0, 180, 30, 15);
    bg.fill({ color: 0x1a1a5e, alpha: 0.9 });
    bg.stroke({ color: 0x4488ff, width: 1, alpha: 0.6 });
    notif.addChild(bg);

    const text = new Text({
      text: `${emoji} ${name} 발견!`,
      style: new TextStyle({ fontSize: 12, fill: 0xffffff, fontWeight: 'bold' }),
    });
    text.x = 12;
    text.y = 6;
    notif.addChild(text);

    this.notifContainer.addChild(notif);

    // Slide in from right
    gsap.to(notif, { x: GAME_WIDTH - 192, duration: 0.3, ease: 'power2.out' });
    // Fade out after 3 seconds
    gsap.to(notif, {
      alpha: 0, duration: 0.4, delay: 3, ease: 'power1.out',
      onComplete: () => {
        this.notifContainer.removeChild(notif);
        notif.destroy({ children: true });
      },
    });
  }

  update(): void {
    this.stardustPill.valueText.text = `✦ ${Math.floor(this.gameState.stardust)}`;
    this.cosmicPill.valueText.text = `🔮 ${this.gameState.cosmicEnergy}`;
    this.discoveryPill.valueText.text = `📖 ${this.gameState.discoveredItems.size}/48`;
    const prod = this.gameState.getProductionPerSecond();
    this.productionPill.valueText.text = `⚡ ${prod.toFixed(1)}/초`;
  }
}
