import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';

export class MergeEffect {
  static play(parent: Container, x: number, y: number, color: number): void {
    const fx = new Container();
    fx.x = x;
    fx.y = y;
    parent.addChild(fx);

    // Expanding ring
    const ring = new Graphics();
    ring.circle(0, 0, 10);
    ring.stroke({ color: 0xffffff, width: 3, alpha: 0.8 });
    fx.addChild(ring);

    gsap.to(ring.scale, { x: 4, y: 4, duration: 0.4, ease: 'power2.out' });
    gsap.to(ring, { alpha: 0, duration: 0.4, ease: 'power2.out' });

    // Particle burst (10 particles)
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const p = new Graphics();
      p.circle(0, 0, 2 + Math.random() * 2);
      p.fill({ color, alpha: 0.9 });
      fx.addChild(p);

      const dist = 40 + Math.random() * 30;
      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        alpha: 0,
        duration: 0.35 + Math.random() * 0.15,
        ease: 'power2.out',
      });
    }

    // Flash circle
    const flash = new Graphics();
    flash.circle(0, 0, 20);
    flash.fill({ color: 0xffffff, alpha: 0.7 });
    fx.addChild(flash);

    gsap.to(flash, {
      alpha: 0,
      duration: 0.25,
      ease: 'power1.out',
      onComplete: () => {
        parent.removeChild(fx);
        fx.destroy({ children: true });
      },
    });
  }
}
