import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from '../game/GameState';
import { getEpisodeDef, EPISODES } from '../data/episodes';
import { Panel } from './Panel';
import { GAME_WIDTH } from '../config/constants';

export class EpisodeUI {
  container: Container;
  private gameState: GameState;
  private episodeName: Text;
  private progressBar: Graphics;
  private progressText: Text;
  private unlockBtn: Container | null = null;
  private episodeDots: Graphics[] = [];

  // Callbacks
  onEpisodeUnlock?: (episode: number) => void;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();

    // Panel background
    const panel = new Panel({
      width: GAME_WIDTH - 30, height: 80, radius: 14,
      gradient: true, gradientFrom: 0x1a1a4e, gradientTo: 0x0d0d28,
      fillAlpha: 0.6, strokeColor: 0x2a2a6e, strokeWidth: 1, strokeAlpha: 0.4,
    });
    this.container.addChild(panel);

    const panelW = GAME_WIDTH - 30;

    // Episode name
    this.episodeName = new Text({
      text: 'Ep.1 빅뱅',
      style: new TextStyle({ fontSize: 14, fill: 0xFFD740, fontWeight: 'bold' }),
    });
    this.episodeName.x = 12;
    this.episodeName.y = 8;
    this.container.addChild(this.episodeName);

    // Episode dots (1-6)
    const dotsContainer = new Container();
    dotsContainer.x = panelW - 12;
    dotsContainer.y = 14;
    for (let i = 0; i < EPISODES.length; i++) {
      const dot = new Graphics();
      dot.circle(-(i * 16), 0, 5);
      dot.fill({ color: 0x333366, alpha: 0.5 });
      dotsContainer.addChild(dot);
      this.episodeDots.unshift(dot);
    }
    this.container.addChild(dotsContainer);

    // Progress bar background
    const barY = 32;
    const barW = panelW - 24;
    const barH = 10;

    const barBg = new Graphics();
    barBg.roundRect(12, barY, barW, barH, 5);
    barBg.fill({ color: 0x0D0D28, alpha: 0.8 });
    barBg.stroke({ color: 0x2a2a6e, width: 1, alpha: 0.3 });
    this.container.addChild(barBg);

    // Progress bar fill
    this.progressBar = new Graphics();
    this.progressBar.x = 12;
    this.progressBar.y = barY;
    this.container.addChild(this.progressBar);

    // Progress text
    this.progressText = new Text({
      text: '0/7 아이템 발견',
      style: new TextStyle({ fontSize: 11, fill: 0x8888aa }),
    });
    this.progressText.x = 12;
    this.progressText.y = 48;
    this.container.addChild(this.progressText);

    this.update();
  }

  update(): void {
    const ep = this.gameState.episodes.currentEpisode;
    const def = getEpisodeDef(ep);
    if (!def) return;

    this.episodeName.text = `Ep.${ep} ${def.name}`;

    // Progress
    const progress = this.gameState.episodes.getProgress(this.gameState.discoveredItems);
    const panelW = GAME_WIDTH - 30;
    const barW = panelW - 24;
    const barH = 10;
    const fillW = Math.max(4, (progress.current / Math.max(progress.total, 1)) * barW);

    this.progressBar.clear();
    this.progressBar.roundRect(0, 0, fillW, barH, 5);
    this.progressBar.fill({ color: 0xFFD740, alpha: 0.8 });

    this.progressText.text = `${progress.current}/${progress.total} 아이템 발견`;

    // Episode dots
    for (let i = 0; i < this.episodeDots.length; i++) {
      const dot = this.episodeDots[i];
      dot.clear();
      const epNum = i + 1;
      const isUnlocked = this.gameState.episodes.unlockedEpisodes.has(epNum);
      const isCurrent = epNum === ep;
      const isComplete = this.gameState.episodes.isEpisodeComplete(epNum, this.gameState.discoveredItems);

      // Reverse x position (dots are in a reversed container)
      dot.circle(0, 0, isCurrent ? 6 : 5);
      if (isCurrent) {
        dot.fill({ color: 0xFFD740, alpha: 1 });
      } else if (isComplete) {
        dot.fill({ color: 0x66BB6A, alpha: 0.9 });
      } else if (isUnlocked) {
        dot.fill({ color: 0x4488ff, alpha: 0.7 });
      } else {
        dot.fill({ color: 0x333366, alpha: 0.5 });
      }
    }

    // Unlock button
    this.updateUnlockButton();
  }

  private updateUnlockButton(): void {
    // Remove existing
    if (this.unlockBtn) {
      this.container.removeChild(this.unlockBtn);
      this.unlockBtn.destroy({ children: true });
      this.unlockBtn = null;
    }

    const ep = this.gameState.episodes.currentEpisode;
    const isComplete = this.gameState.episodes.isEpisodeComplete(ep, this.gameState.discoveredItems);
    const nextEp = this.gameState.episodes.getNextEpisode();

    if (!isComplete || !nextEp) return;

    const nextDef = getEpisodeDef(nextEp);
    if (!nextDef) return;

    const canAfford = this.gameState.cosmicEnergy >= nextDef.unlockCost;

    const btn = new Container();
    btn.x = GAME_WIDTH - 30 - 12;
    btn.y = 48;

    const btnBg = new Graphics();
    const btnW = 160;
    btnBg.roundRect(-btnW, 0, btnW, 24, 12);
    btnBg.fill({ color: canAfford ? 0x1a4e1a : 0x1a1a4e, alpha: 0.9 });
    btnBg.stroke({ color: canAfford ? 0x66BB6A : 0x666688, width: 1, alpha: 0.6 });
    btn.addChild(btnBg);

    const costColor = canAfford ? 0x66BB6A : 0xff6666;
    const btnText = new Text({
      text: `Ep.${nextEp} 해금 (🔮${nextDef.unlockCost})`,
      style: new TextStyle({ fontSize: 11, fill: costColor, fontWeight: 'bold' }),
    });
    btnText.anchor.set(0.5, 0.5);
    btnText.x = -btnW / 2;
    btnText.y = 12;
    btn.addChild(btnText);

    if (canAfford) {
      btnBg.eventMode = 'static';
      btnBg.cursor = 'pointer';
      btnBg.on('pointertap', () => {
        if (this.gameState.unlockEpisode(nextEp)) {
          this.onEpisodeUnlock?.(nextEp);
          this.update();
          // Button flash
          gsap.fromTo(btn, { alpha: 0.5 }, { alpha: 1, duration: 0.3 });
        }
      });
    }

    this.container.addChild(btn);
    this.unlockBtn = btn;

    // Pulse animation for unlock button
    if (canAfford) {
      gsap.to(btnBg, { alpha: 0.6, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
  }
}
