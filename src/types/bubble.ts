
export interface BubbleType {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export interface BubblePhysicsConfig {
  gravity: number;
  friction: number;
  minSpeed: number;
  maxSpeed: number;
  collisionDamping: number;
}

export interface BubbleEffectProps {
  count?: number;
  className?: string;
}
