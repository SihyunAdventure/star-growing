import { Container, Graphics } from 'pixi.js';

interface Star {
  graphic: Graphics;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  driftSpeed: number;
}

export class Starfield {
  container: Container;
  private stars: Star[] = [];
  private width: number;
  private height: number;
  private elapsed = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.container = new Container();

    // Layer 1: 80 small, slow, dim stars
    this.createStars(80, 0.5, 1.2, 0.15, 0.35, 2);
    // Layer 2: 50 medium stars
    this.createStars(50, 1.0, 2.0, 0.3, 0.6, 4);
    // Layer 3: 25 large, bright, fast stars
    this.createStars(25, 1.5, 3.0, 0.5, 0.9, 7);
  }

  private createStars(
    count: number,
    minSize: number,
    maxSize: number,
    minAlpha: number,
    maxAlpha: number,
    driftSpeed: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      const alpha = minAlpha + Math.random() * (maxAlpha - minAlpha);

      const g = new Graphics();
      g.circle(0, 0, size);
      g.fill({ color: 0xffffff });
      g.x = Math.random() * this.width;
      g.y = Math.random() * this.height;
      g.alpha = alpha;

      this.container.addChild(g);
      this.stars.push({
        graphic: g,
        baseAlpha: alpha,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 1.7,
        driftSpeed,
      });
    }
  }

  update(dt: number): void {
    this.elapsed += dt;
    for (const star of this.stars) {
      const twinkle = Math.sin(this.elapsed * star.twinkleSpeed * Math.PI * 2 + star.phase);
      star.graphic.alpha = Math.max(0.05, star.baseAlpha + twinkle * 0.2);

      star.graphic.y += star.driftSpeed * dt;
      if (star.graphic.y > this.height + 5) {
        star.graphic.y = -5;
        star.graphic.x = Math.random() * this.width;
      }
    }
  }
}
