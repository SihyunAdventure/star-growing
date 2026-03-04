import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import { EpisodeDef } from '../data/episodes';

interface Star {
  graphic: Graphics;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  driftSpeed: number;
  color: number;
}

export interface StarTheme {
  starColor: number;
  starCount: number;
  particleColor?: number;
}

export class Starfield {
  container: Container;
  private stars: Star[] = [];
  private width: number;
  private height: number;
  private elapsed = 0;
  private currentColor = 0xffffff;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.container = new Container();

    // Default theme (white stars)
    this.buildStars(155, 0xffffff);
  }

  private buildStars(totalCount: number, color: number): void {
    // Layer distribution: ~52% small, ~32% medium, ~16% large
    const l1 = Math.round(totalCount * 0.52);
    const l2 = Math.round(totalCount * 0.32);
    const l3 = totalCount - l1 - l2;

    this.createStars(l1, 0.5, 1.2, 0.15, 0.35, 2, color);
    this.createStars(l2, 1.0, 2.0, 0.3, 0.6, 4, color);
    this.createStars(l3, 1.5, 3.0, 0.5, 0.9, 7, color);
  }

  private createStars(
    count: number,
    minSize: number,
    maxSize: number,
    minAlpha: number,
    maxAlpha: number,
    driftSpeed: number,
    color: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      const alpha = minAlpha + Math.random() * (maxAlpha - minAlpha);

      const g = new Graphics();
      g.circle(0, 0, size);
      g.fill({ color });
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
        color,
      });
    }
  }

  /** Smoothly transition to a new episode theme */
  setTheme(theme: EpisodeDef['bgTheme']): void {
    const newColor = theme.starColor;
    const newCount = theme.starCount;

    if (newColor === this.currentColor && this.stars.length === newCount) return;
    this.currentColor = newColor;

    // Fade out existing stars
    gsap.to(this.container, {
      alpha: 0, duration: 0.5, ease: 'power1.out',
      onComplete: () => {
        // Remove all existing stars
        for (const star of this.stars) {
          star.graphic.destroy();
        }
        this.stars = [];
        while (this.container.children.length > 0) {
          this.container.removeChildAt(0);
        }

        // Build new stars with theme
        this.buildStars(newCount, newColor);

        // Add particle-colored accent stars if theme has particleColor
        if (theme.particleColor) {
          const accentCount = Math.round(newCount * 0.15);
          this.createStars(accentCount, 0.8, 1.8, 0.2, 0.5, 3, theme.particleColor);
        }

        // Fade in
        gsap.to(this.container, { alpha: 1, duration: 0.8, ease: 'power1.in' });
      },
    });
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
