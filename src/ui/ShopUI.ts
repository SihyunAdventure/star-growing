import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { GameState } from '../game/GameState';
import { UPGRADES, UpgradeDef } from '../data/upgrades';
import { Panel } from './Panel';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { RECIPES, Recipe } from '../data/combinations';

export class ShopUI {
  container: Container;
  private gameState: GameState;
  private overlay: Graphics;
  private panel: Container;
  private cardContainer: Container;
  private resText!: Text;
  private visible = false;

  // Callbacks
  onPurchase?: (upgradeId: string) => void;
  onRecipeHint?: (recipe: Recipe) => void;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();
    this.container.visible = false;

    // Dark overlay
    this.overlay = new Graphics();
    this.overlay.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.overlay.fill({ color: 0x000000, alpha: 0.7 });
    this.overlay.eventMode = 'static';
    this.overlay.on('pointertap', () => this.hide());
    this.container.addChild(this.overlay);

    // Shop panel
    this.panel = new Container();
    this.panel.x = GAME_WIDTH / 2;
    this.panel.y = GAME_HEIGHT / 2;
    this.container.addChild(this.panel);

    const panelW = GAME_WIDTH - 40;
    const panelH = 520;

    const bg = new Panel({
      width: panelW, height: panelH, radius: 20,
      gradient: true, gradientFrom: 0x1a1a5e, gradientTo: 0x0d0d35,
      fillAlpha: 0.95, strokeColor: 0x4488ff, strokeWidth: 2, strokeAlpha: 0.6,
    });
    bg.x = -panelW / 2;
    bg.y = -panelH / 2;
    this.panel.addChild(bg);

    // Stop event propagation on panel
    bg.bg.eventMode = 'static';
    bg.bg.on('pointertap', (e: { stopPropagation: () => void }) => e.stopPropagation());

    // Title
    const title = new Text({
      text: '업그레이드 상점',
      style: new TextStyle({ fontSize: 18, fill: 0xFFD740, fontWeight: 'bold', letterSpacing: 2 }),
    });
    title.anchor.set(0.5);
    title.y = -panelH / 2 + 28;
    this.panel.addChild(title);

    // Resource display
    const resText = new Text({
      text: '',
      style: new TextStyle({ fontSize: 12, fill: 0xaaaacc }),
    });
    resText.anchor.set(0.5);
    resText.y = -panelH / 2 + 50;
    this.panel.addChild(resText);
    this.resText = resText;

    // Close button
    const closeBtn = new Graphics();
    closeBtn.circle(panelW / 2 - 20, -panelH / 2 + 20, 14);
    closeBtn.fill({ color: 0xff4444, alpha: 0.3 });
    closeBtn.stroke({ color: 0xff4444, width: 1.5, alpha: 0.8 });
    closeBtn.eventMode = 'static';
    closeBtn.cursor = 'pointer';
    closeBtn.on('pointertap', (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      this.hide();
    });
    this.panel.addChild(closeBtn);

    const closeX = new Text({
      text: '✕',
      style: new TextStyle({ fontSize: 14, fill: 0xff6666 }),
    });
    closeX.anchor.set(0.5);
    closeX.x = panelW / 2 - 20;
    closeX.y = -panelH / 2 + 20;
    this.panel.addChild(closeX);

    // Card container (scrollable area)
    this.cardContainer = new Container();
    this.cardContainer.y = -panelH / 2 + 70;
    this.panel.addChild(this.cardContainer);
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.container.visible = true;
    this.renderCards();
    this.panel.scale.set(0);
    gsap.to(this.panel.scale, { x: 1, y: 1, duration: 0.3, ease: 'back.out(1.5)' });
    this.overlay.alpha = 0;
    gsap.to(this.overlay, { alpha: 1, duration: 0.2 });
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    gsap.to(this.panel.scale, { x: 0, y: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(this.overlay, {
      alpha: 0, duration: 0.2,
      onComplete: () => { this.container.visible = false; },
    });
  }

  isVisible(): boolean {
    return this.visible;
  }

  private renderCards(): void {
    // Clear
    while (this.cardContainer.children.length > 0) {
      this.cardContainer.removeChildAt(0);
    }

    // Update resource text
    const resText = this.resText;
    resText.text = `✦ ${Math.floor(this.gameState.stardust)}  |  🔮 ${this.gameState.cosmicEnergy}`;

    const panelW = GAME_WIDTH - 40;
    const cardW = panelW - 30;
    const cardH = 72;
    const cardGap = 8;
    let yOffset = 0;

    const upgradeIds = Object.keys(UPGRADES);
    for (const upgradeId of upgradeIds) {
      const def = UPGRADES[upgradeId];
      const card = this.createUpgradeCard(def, cardW, cardH);
      card.x = -cardW / 2;
      card.y = yOffset;
      this.cardContainer.addChild(card);
      yOffset += cardH + cardGap;
    }
  }

  private createUpgradeCard(def: UpgradeDef, cardW: number, cardH: number): Container {
    const card = new Container();
    const level = this.gameState.upgrades.getLevel(def.id);
    const isMaxed = this.gameState.upgrades.isMaxed(def.id);
    const nextCost = this.gameState.upgrades.getNextCost(def.id);
    const canAfford = nextCost
      ? (nextCost.currency === 'stardust'
        ? this.gameState.stardust >= nextCost.cost
        : this.gameState.cosmicEnergy >= nextCost.cost)
      : false;

    const accentColor = def.currency === 'stardust' ? 0xFFD700 : 0xBB86FC;

    // Card background
    const bg = new Graphics();
    bg.roundRect(0, 0, cardW, cardH, 10);
    bg.fill({ color: 0x12123a, alpha: 0.8 });
    bg.stroke({ color: accentColor, width: 1, alpha: isMaxed ? 0.2 : 0.5 });
    card.addChild(bg);

    // Accent bar
    const accent = new Graphics();
    accent.roundRect(0, 4, 3, cardH - 8, 1.5);
    accent.fill({ color: accentColor, alpha: isMaxed ? 0.3 : 0.8 });
    card.addChild(accent);

    // Name
    const name = new Text({
      text: def.name,
      style: new TextStyle({ fontSize: 13, fill: isMaxed ? 0x666688 : 0xffffff, fontWeight: 'bold' }),
    });
    name.x = 12;
    name.y = 8;
    card.addChild(name);

    // Level indicator
    const levelText = new Text({
      text: isMaxed ? 'MAX' : `Lv.${level}/${def.maxLevel}`,
      style: new TextStyle({ fontSize: 11, fill: isMaxed ? 0x66BB6A : 0x8888aa }),
    });
    levelText.x = 12;
    levelText.y = 26;
    card.addChild(levelText);

    // Description
    const desc = new Text({
      text: def.description,
      style: new TextStyle({ fontSize: 10, fill: 0x666688, wordWrap: true, wordWrapWidth: cardW - 120 }),
    });
    desc.x = 12;
    desc.y = 44;
    card.addChild(desc);

    // Buy button
    if (!isMaxed && nextCost) {
      const btnW = 90;
      const btnH = 30;
      const btnX = cardW - btnW - 10;
      const btnY = (cardH - btnH) / 2;

      const btn = new Graphics();
      btn.roundRect(btnX, btnY, btnW, btnH, 8);
      btn.fill({ color: canAfford ? 0x1a4e2a : 0x1a1a2a, alpha: 0.9 });
      btn.stroke({ color: canAfford ? 0x66BB6A : 0x444466, width: 1, alpha: 0.6 });
      card.addChild(btn);

      const currencyIcon = nextCost.currency === 'stardust' ? '✦' : '🔮';
      const costText = new Text({
        text: `${currencyIcon} ${nextCost.cost}`,
        style: new TextStyle({
          fontSize: 12, fill: canAfford ? 0x66BB6A : 0xff6666, fontWeight: 'bold',
        }),
      });
      costText.anchor.set(0.5);
      costText.x = btnX + btnW / 2;
      costText.y = btnY + btnH / 2;
      card.addChild(costText);

      if (canAfford) {
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointertap', (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          this.handlePurchase(def.id);
        });
      }
    }

    return card;
  }

  private handlePurchase(upgradeId: string): void {
    // Special handling for recipe hint
    if (upgradeId === 'recipeHint') {
      const hint = this.findUndiscoveredRecipe();
      if (!hint) return;
      if (this.gameState.purchaseUpgrade(upgradeId)) {
        this.onRecipeHint?.(hint);
        this.renderCards();
      }
      return;
    }

    if (this.gameState.purchaseUpgrade(upgradeId)) {
      this.onPurchase?.(upgradeId);
      this.renderCards();

      // Flash effect
      gsap.fromTo(this.panel, { alpha: 0.7 }, { alpha: 1, duration: 0.3 });
    }
  }

  private findUndiscoveredRecipe(): Recipe | undefined {
    const maxEp = this.gameState.episodes.currentEpisode;
    for (const recipe of RECIPES) {
      if (recipe.episode !== undefined && recipe.episode > maxEp) continue;
      const key = [...recipe.inputs].sort().join('+') + '>' + recipe.output;
      // Check if all inputs are discovered
      const inputsDiscovered = recipe.inputs.every(id => this.gameState.discoveredItems.has(id));
      if (!inputsDiscovered) continue;
      // Check if recipe itself is not yet discovered
      const isKnown = this.gameState.discoveredRecipes.some(
        dr => [...dr.inputs].sort().join('+') + '>' + dr.output === key
      );
      if (!isKnown) return recipe;
    }
    return undefined;
  }
}
