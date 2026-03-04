import { Application, Container, Graphics, FillGradient } from 'pixi.js';
import { Board } from './game/Board';
import { WaitingSlots } from './game/WaitingSlots';
import { AutoGenerator } from './game/AutoGenerator';
import { GameState } from './game/GameState';
import { HUD } from './ui/HUD';
import { Starfield } from './effects/Starfield';
import { DiscoveryEffect } from './effects/DiscoveryEffect';

const GAME_WIDTH = 390;
const GAME_HEIGHT = 844;

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

  // Responsive scaling
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

  // Game state
  const gameState = new GameState();

  // Layer structure: bg → stars → game → effects → UI
  const bgLayer = new Container();
  const starLayer = new Container();
  const gameLayer = new Container();
  const effectLayer = new Container();
  const uiLayer = new Container();
  app.stage.addChild(bgLayer, starLayer, gameLayer, effectLayer, uiLayer);

  // Background gradient
  const bgGrad = new Graphics();
  const gradient = new FillGradient({
    type: 'linear',
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    colorStops: [
      { offset: 0, color: '#02020F' },
      { offset: 0.6, color: '#050518' },
      { offset: 1, color: '#070720' },
    ],
  });
  bgGrad.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  bgGrad.fill(gradient);
  bgLayer.addChild(bgGrad);

  // Starfield
  const starfield = new Starfield(GAME_WIDTH, GAME_HEIGHT);
  starLayer.addChild(starfield.container);

  // Board (4x4)
  const board = new Board(gameState);
  board.container.x = (GAME_WIDTH - board.width) / 2;
  board.container.y = 180;
  gameLayer.addChild(board.container);

  // Waiting slots (3 slots below board)
  const waitingSlots = new WaitingSlots(gameState, board);
  waitingSlots.container.x = (GAME_WIDTH - waitingSlots.width) / 2;
  waitingSlots.container.y = board.container.y + board.height + 30;
  gameLayer.addChild(waitingSlots.container);

  // Auto generator
  const autoGenerator = new AutoGenerator(gameState, waitingSlots);

  // HUD
  const hud = new HUD(gameState);
  hud.container.x = 0;
  hud.container.y = 0;
  uiLayer.addChild(hud.container);

  // Discovery event → show celebration overlay
  gameState.onDiscovery = (itemId) => {
    hud.onNewDiscovery(itemId);
    DiscoveryEffect.show(effectLayer, itemId);
  };

  // Game loop
  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime / 60; // seconds
    starfield.update(dt);
    autoGenerator.update(dt);
    gameState.updateProduction(dt);
    hud.update();
  });
}

main().catch(console.error);
