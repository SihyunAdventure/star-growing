import { Container, Graphics, FillGradient } from 'pixi.js';

export interface PanelOptions {
  width: number;
  height: number;
  radius?: number;
  fillColor?: number;
  fillAlpha?: number;
  strokeColor?: number;
  strokeWidth?: number;
  strokeAlpha?: number;
  gradient?: boolean;
  gradientFrom?: number;
  gradientTo?: number;
}

export function hexToRgba(hex: number, alpha: number): string {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

export class Panel extends Container {
  bg: Graphics;

  constructor(options: PanelOptions) {
    super();

    const {
      width,
      height,
      radius = 16,
      fillColor = 0x1a1a4e,
      fillAlpha = 0.8,
      strokeColor = 0x2a2a8e,
      strokeWidth = 1.5,
      strokeAlpha = 0.6,
      gradient = false,
      gradientFrom = 0x1a1a4e,
      gradientTo = 0x0d0d28,
    } = options;

    this.bg = new Graphics();

    if (gradient) {
      const grad = new FillGradient({
        type: 'linear',
        start: { x: 0.5, y: 0 },
        end: { x: 0.5, y: 1 },
        colorStops: [
          { offset: 0, color: hexToRgba(gradientFrom, fillAlpha) },
          { offset: 1, color: hexToRgba(gradientTo, fillAlpha) },
        ],
      });
      this.bg.roundRect(0, 0, width, height, radius);
      this.bg.fill(grad);
    } else {
      this.bg.roundRect(0, 0, width, height, radius);
      this.bg.fill({ color: fillColor, alpha: fillAlpha });
    }

    this.bg.stroke({ color: strokeColor, width: strokeWidth, alpha: strokeAlpha });
    this.addChild(this.bg);
  }
}
