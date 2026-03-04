import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { GameState, DiscoveredRecipe } from '../game/GameState';
import { getItemDef } from '../data/items';
import { Panel } from './Panel';
import { RECIPES } from '../data/combinations';

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
  private recipeContainer: Container;
  private recipeCards: Container[] = [];
  private recipeEntries: DiscoveredRecipe[] = [];
  private recipeCountLabel: Text;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();

    // Header panel
    const header = new Panel({
      width: GAME_WIDTH, height: 65, radius: 0,
      gradient: true, gradientFrom: 0x0d0d40, gradientTo: 0x08082a,
      fillAlpha: 0.92, strokeWidth: 0, strokeAlpha: 0,
    });
    this.container.addChild(header);

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

    // Recipe section
    const recipePanel = new Panel({
      width: GAME_WIDTH, height: 105, radius: 0,
      fillColor: 0x08082a, fillAlpha: 0.5, strokeWidth: 0, strokeAlpha: 0,
    });
    recipePanel.y = 65;
    this.container.addChild(recipePanel);

    // Recipe section header
    this.recipeCountLabel = new Text({
      text: `발견 레시피 (0/${RECIPES.length})`,
      style: new TextStyle({ fontSize: 12, fill: 0x888899 }),
    });
    this.recipeCountLabel.x = 15;
    this.recipeCountLabel.y = 70;
    this.container.addChild(this.recipeCountLabel);

    // Recipe cards container
    this.recipeContainer = new Container();
    this.recipeContainer.x = 15;
    this.recipeContainer.y = 88;
    this.container.addChild(this.recipeContainer);

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

  /** Called when a new recipe is discovered */
  addRecipeCard(recipe: DiscoveredRecipe): void {
    this.recipeEntries.unshift(recipe);
    if (this.recipeEntries.length > 3) this.recipeEntries.pop();
    this.renderRecipeCards();
    this.recipeCountLabel.text = `발견 레시피 (${this.gameState.discoveredRecipes.length}/${RECIPES.length})`;
  }

  /** Called when a new item is first discovered */
  showDiscoveryNotification(itemId: string): void {
    const def = getItemDef(itemId);
    if (!def) return;
    this.showNotification(def.emoji, def.name);
  }

  // kept for backward compat from main.ts
  onNewDiscovery(itemId: string): void {
    this.showDiscoveryNotification(itemId);
  }

  private renderRecipeCards(): void {
    for (const card of this.recipeCards) {
      this.recipeContainer.removeChild(card);
      card.destroy({ children: true });
    }
    this.recipeCards = [];

    for (let i = 0; i < this.recipeEntries.length; i++) {
      const card = this.createRecipeCard(this.recipeEntries[i], i);
      this.recipeContainer.addChild(card);
      this.recipeCards.push(card);

      // Slide-in animation for newest card
      if (i === 0) {
        card.alpha = 0;
        card.x = 20;
        gsap.to(card, { x: 0, alpha: 1, duration: 0.3, ease: 'power2.out' });
      }
    }
  }

  private createRecipeCard(recipe: DiscoveredRecipe, index: number): Container {
    const card = new Container();
    card.y = index * 28;

    const cardW = GAME_WIDTH - 30;
    const outputDef = getItemDef(recipe.output);
    const accentColor = outputDef?.color ?? 0x4488ff;

    // Card background
    const bg = new Graphics();
    bg.roundRect(0, 0, cardW, 25, 6);
    bg.fill({ color: 0x12123a, alpha: 0.6 });
    bg.stroke({ color: accentColor, width: 0.5, alpha: 0.2 });
    card.addChild(bg);

    // Color accent bar (left)
    const accent = new Graphics();
    accent.roundRect(0, 2, 3, 21, 1.5);
    accent.fill({ color: accentColor, alpha: 0.8 });
    card.addChild(accent);

    // Recipe flow: emoji + emoji → emoji name
    const inputEmojis = recipe.inputs.map(id => getItemDef(id)?.emoji ?? '?').join(' + ');
    const outputEmoji = outputDef?.emoji ?? '?';
    const outputName = outputDef?.name ?? '???';

    const recipeText = new Text({
      text: `${inputEmojis}  →  ${outputEmoji} ${outputName}`,
      style: new TextStyle({ fontSize: 11, fill: 0xddddee }),
    });
    recipeText.x = 10;
    recipeText.y = 1;
    card.addChild(recipeText);

    // Science note
    const noteText = new Text({
      text: recipe.scienceNote,
      style: new TextStyle({ fontSize: 9, fill: 0x777799 }),
    });
    noteText.x = 10;
    noteText.y = 14;
    card.addChild(noteText);

    return card;
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

    gsap.to(notif, { x: GAME_WIDTH - 192, duration: 0.3, ease: 'power2.out' });
    gsap.to(notif, {
      alpha: 0, duration: 0.4, delay: 3, ease: 'power1.out',
      onComplete: () => { this.notifContainer.removeChild(notif); notif.destroy({ children: true }); },
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
