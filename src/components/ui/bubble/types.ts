
export interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
}
