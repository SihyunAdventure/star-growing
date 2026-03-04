import { Application, Container, Graphics, FillGradient } from 'pixi.js';
import gsap from 'gsap';
import { Board } from './game/Board';
import { WaitingSlots } from './game/WaitingSlots';
import { AutoGenerator } from './game/AutoGenerator';
import { GameState } from './game/GameState';
import { HUD } from './ui/HUD';
import { EpisodeUI } from './ui/EpisodeUI';
import { ShopUI } from './ui/ShopUI';
import { WinScreen } from './ui/WinScreen';
import { Starfield } from './effects/Starfield';
import { DiscoveryEffect } from './effects/DiscoveryEffect';
import { getEpisodeDef } from './data/episodes';
import { GAME_WIDTH, GAME_HEIGHT } from './config/constants';

async function main() {
  const app = new Application();
  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x02020F,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true,
    antialias: true,
  });

  const container = document.getElementById('game-container')!;
  container.appendChild(app.canvas as HTMLCanvasElement);

  function resize() {
    const scale = Math.min(
      window.innerWidth / GAME_WIDTH,
      window.innerHeight / GAME_HEIGHT
    );
    const canvas = app.canvas as HTMLCanvasElement;
    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;
  }
  window.addEventListener('resize', resize);
  resize();

  const gameState = new GameState();

  // Layer structure
  const bgLayer = new Container();
  const starLayer = new Container();
  const gameLayer = new Container();
  const effectLayer = new Container();
  const uiLayer = new Container();
  const overlayLayer = new Container();
  app.stage.addChild(bgLayer, starLayer, gameLayer, effectLayer, uiLayer, overlayLayer);

  // Background gradient
  const bgGrad = new Graphics();
  let currentBgFrom = '#02020F';
  let currentBgTo = '#070720';

  function drawBgGradient(from: string, to: string) {
    bgGrad.clear();
    const grad = new FillGradient({
      type: 'linear', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 },
      colorStops: [
        { offset: 0, color: from },
        { offset: 0.6, color: to },
        { offset: 1, color: to },
      ],
    });
    bgGrad.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    bgGrad.fill(grad);
  }
  drawBgGradient(currentBgFrom, currentBgTo);
  bgLayer.addChild(bgGrad);

  // Starfield
  const starfield = new Starfield(GAME_WIDTH, GAME_HEIGHT);
  starLayer.addChild(starfield.container);

  // Board
  const board = new Board(gameState);
  board.container.x = (GAME_WIDTH - board.width) / 2;
  board.container.y = 180;
  gameLayer.addChild(board.container);

  // Waiting slots
  const waitingSlots = new WaitingSlots(gameState, board);
  waitingSlots.container.x = (GAME_WIDTH - waitingSlots.width) / 2;
  waitingSlots.container.y = board.container.y + board.height + 30;
  gameLayer.addChild(waitingSlots.container);

  // Auto generator
  const autoGenerator = new AutoGenerator(gameState, waitingSlots, board);

  // HUD
  const hud = new HUD(gameState);
  uiLayer.addChild(hud.container);

  // Episode UI (below waiting slots)
  const episodeUI = new EpisodeUI(gameState);
  episodeUI.container.x = 15;
  episodeUI.container.y = waitingSlots.container.y + 100;
  uiLayer.addChild(episodeUI.container);

  // Shop UI (overlay)
  const shopUI = new ShopUI(gameState);
  overlayLayer.addChild(shopUI.container);

  // Win Screen (overlay)
  const winScreen = new WinScreen(gameState);
  overlayLayer.addChild(winScreen.container);

  // --- Helper: reposition board + slots after resize ---
  function repositionGameElements() {
    board.container.x = (GAME_WIDTH - board.width) / 2;
    waitingSlots.container.x = (GAME_WIDTH - waitingSlots.width) / 2;
    waitingSlots.container.y = board.container.y + board.height + 30;
    episodeUI.container.y = waitingSlots.container.y + 100;
  }

  // --- Helper: change background theme ---
  function switchBgTheme(episodeNum: number) {
    const def = getEpisodeDef(episodeNum);
    if (!def) return;

    // Starfield theme
    starfield.setTheme(def.bgTheme);

    // Background gradient crossfade
    const newFrom = def.bgTheme.gradientFrom;
    const newTo = def.bgTheme.gradientTo;

    // Create temp overlay for crossfade
    const tempBg = new Graphics();
    const tempGrad = new FillGradient({
      type: 'linear', start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 },
      colorStops: [
        { offset: 0, color: newFrom },
        { offset: 0.6, color: newTo },
        { offset: 1, color: newTo },
      ],
    });
    tempBg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    tempBg.fill(tempGrad);
    tempBg.alpha = 0;
    bgLayer.addChild(tempBg);

    gsap.to(tempBg, {
      alpha: 1, duration: 1, ease: 'power1.inOut',
      onComplete: () => {
        drawBgGradient(newFrom, newTo);
        currentBgFrom = newFrom;
        currentBgTo = newTo;
        bgLayer.removeChild(tempBg);
        tempBg.destroy();
      },
    });
  }

  // --- Wire HUD callbacks ---
  hud.onShopOpen = () => shopUI.show();

  // --- Wire EpisodeUI callbacks ---
  episodeUI.onEpisodeUnlock = (ep) => {
    switchBgTheme(ep);
    hud.showEpisodeComplete(ep - 1);
    episodeUI.update();
  };

  // --- Wire ShopUI callbacks ---
  shopUI.onPurchase = (upgradeId) => {
    if (upgradeId === 'boardExpansion') {
      const newSize = gameState.upgrades.getBoardSize();
      gameState.resizeBoard(newSize);
      board.resize(newSize);
      repositionGameElements();
    } else if (upgradeId === 'waitingSlotExpansion') {
      const newCount = gameState.upgrades.getSlotCount();
      waitingSlots.expandSlots(newCount);
      repositionGameElements();
    }
    // generatorSpeed and autoMerger are handled automatically via UpgradeSystem getters
  };

  shopUI.onRecipeHint = (recipe) => {
    // Show the hint as a discovered recipe in HUD
    gameState.recordRecipe(recipe.inputs, recipe.output, recipe.scienceNote || '');
  };

  // --- Wire WinScreen ---
  winScreen.onRestart = () => {
    // Reload the page for a clean restart
    window.location.reload();
  };

  // --- Wire GameState event callbacks ---
  gameState.onDiscovery = (itemId) => {
    hud.showDiscoveryNotification(itemId);
    DiscoveryEffect.show(effectLayer, itemId);
    episodeUI.update();

    // Check episode completion
    const ep = gameState.episodes.currentEpisode;
    if (gameState.episodes.isEpisodeComplete(ep, gameState.discoveredItems)) {
      hud.showEpisodeComplete(ep);
    }

    // Check win condition
    if (gameState.episodes.checkWinCondition(gameState.discoveredItems)) {
      winScreen.show();
    }
  };

  gameState.onRecipeDiscovered = (recipe) => {
    hud.addRecipeCard(recipe);
  };

  // Apply initial episode theme
  const initialDef = getEpisodeDef(1);
  if (initialDef) {
    starfield.setTheme(initialDef.bgTheme);
    drawBgGradient(initialDef.bgTheme.gradientFrom, initialDef.bgTheme.gradientTo);
  }

  // Game loop
  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime / 60;
    starfield.update(dt);
    autoGenerator.update(dt);
    gameState.updateProduction(dt);
    hud.update();
  });
}

main().catch(console.error);
