
import { BubbleType, BubblePhysicsConfig } from "@/types/bubble";

export const PHYSICS_CONFIG: BubblePhysicsConfig = {
  gravity: 0.15,
  friction: 0.98,
  minSpeed: 0.3,
  maxSpeed: 4,
  collisionDamping: 0.8
};

export const createBubble = (id: number, windowWidth: number, windowHeight: number): BubbleType => {
  const size = Math.random() * 80 + 20;
  return {
    id,
    x: Math.random() * (windowWidth - size),
    y: Math.random() * (windowHeight - size),
    size,
    speedX: (Math.random() - 0.5) * 4,
    speedY: (Math.random() - 0.5) * 4,
    opacity: Math.random() * 0.6 + 0.2,
    hue: Math.random() * 60 + 180
  };
};

export const updateBubblePosition = (
  bubble: BubbleType, 
  windowWidth: number, 
  windowHeight: number
): BubbleType => {
  let newX = bubble.x + bubble.speedX;
  let newY = bubble.y + bubble.speedY;
  let newSpeedX = bubble.speedX * PHYSICS_CONFIG.friction;
  let newSpeedY = (bubble.speedY + PHYSICS_CONFIG.gravity) * PHYSICS_CONFIG.friction;

  // Boundary collisions with damping
  if (newX <= 0 || newX >= windowWidth - bubble.size) {
    newSpeedX = -newSpeedX * PHYSICS_CONFIG.collisionDamping;
    newX = Math.max(0, Math.min(windowWidth - bubble.size, newX));
  }
  
  if (newY <= 0 || newY >= windowHeight - bubble.size) {
    newSpeedY = -newSpeedY * PHYSICS_CONFIG.collisionDamping;
    newY = Math.max(0, Math.min(windowHeight - bubble.size, newY));
  }

  // Speed constraints
  const speed = Math.sqrt(newSpeedX * newSpeedX + newSpeedY * newSpeedY);
  if (speed > PHYSICS_CONFIG.maxSpeed) {
    const factor = PHYSICS_CONFIG.maxSpeed / speed;
    newSpeedX *= factor;
    newSpeedY *= factor;
  }
  
  if (speed < PHYSICS_CONFIG.minSpeed && speed > 0) {
    const factor = PHYSICS_CONFIG.minSpeed / speed;
    newSpeedX *= factor;
    newSpeedY *= factor;
  }

  return {
    ...bubble,
    x: newX,
    y: newY,
    speedX: newSpeedX,
    speedY: newSpeedY
  };
};

export const checkBubbleCollision = (bubble1: BubbleType, bubble2: BubbleType): boolean => {
  const dx = bubble1.x - bubble2.x;
  const dy = bubble1.y - bubble2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = (bubble1.size + bubble2.size) / 2;
  
  return distance < minDistance;
};

export const resolveBubbleCollision = (bubble1: BubbleType, bubble2: BubbleType): [BubbleType, BubbleType] => {
  const dx = bubble2.x - bubble1.x;
  const dy = bubble2.y - bubble1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return [bubble1, bubble2];
  
  const normalX = dx / distance;
  const normalY = dy / distance;
  
  const relativeVelocityX = bubble2.speedX - bubble1.speedX;
  const relativeVelocityY = bubble2.speedY - bubble1.speedY;
  
  const separatingVelocity = relativeVelocityX * normalX + relativeVelocityY * normalY;
  
  if (separatingVelocity > 0) return [bubble1, bubble2];
  
  const newSeparatingVelocity = -separatingVelocity * PHYSICS_CONFIG.collisionDamping;
  const deltaVelocity = newSeparatingVelocity - separatingVelocity;
  
  const impulse = deltaVelocity / 2;
  const impulseX = impulse * normalX;
  const impulseY = impulse * normalY;
  
  return [
    {
      ...bubble1,
      speedX: bubble1.speedX - impulseX,
      speedY: bubble1.speedY - impulseY
    },
    {
      ...bubble2,
      speedX: bubble2.speedX + impulseX,
      speedY: bubble2.speedY + impulseY
    }
  ];
};
