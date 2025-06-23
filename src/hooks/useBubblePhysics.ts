
import { useCallback, useRef } from 'react';

interface BubblePhysics {
  id: number;
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
  mass: number;
  restitution: number; // Bounciness factor
}

export const useBubblePhysics = () => {
  const physicsRef = useRef<Map<number, BubblePhysics>>(new Map());
  const lastUpdateRef = useRef<number>(Date.now());

  const initializeBubble = useCallback((bubble: any) => {
    const mass = bubble.size * 0.1; // Mass proportional to size
    const restitution = Math.max(0.3, 1 - (bubble.size / 100)); // Smaller bubbles bounce more
    
    physicsRef.current.set(bubble.id, {
      id: bubble.id,
      x: bubble.x,
      y: bubble.y,
      size: bubble.size,
      velocityX: bubble.velocityX || (Math.random() - 0.5) * 0.5,
      velocityY: bubble.velocityY || (Math.random() - 0.5) * 0.5,
      mass,
      restitution
    });
  }, []);

  const checkCollision = useCallback((bubble1: BubblePhysics, bubble2: BubblePhysics): boolean => {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (bubble1.size + bubble2.size) / 2 * 0.015; // Convert px to %
    
    return distance < minDistance;
  }, []);

  const resolveCollision = useCallback((bubble1: BubblePhysics, bubble2: BubblePhysics) => {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return; // Prevent division by zero
    
    // Normalize collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Relative velocity
    const dvx = bubble1.velocityX - bubble2.velocityX;
    const dvy = bubble1.velocityY - bubble2.velocityY;
    
    // Relative velocity in collision normal direction
    const dvn = dvx * nx + dvy * ny;
    
    // Do not resolve if velocities are separating
    if (dvn > 0) return;
    
    // Collision restitution (bounciness)
    const restitution = Math.min(bubble1.restitution, bubble2.restitution);
    
    // Collision impulse
    const impulse = (2 * dvn) / (bubble1.mass + bubble2.mass);
    
    // Apply impulse based on mass and restitution
    const impulseX = impulse * bubble2.mass * nx * restitution;
    const impulseY = impulse * bubble2.mass * ny * restitution;
    
    bubble1.velocityX -= impulseX;
    bubble1.velocityY -= impulseY;
    bubble2.velocityX += impulse * bubble1.mass * nx * restitution;
    bubble2.velocityY += impulse * bubble1.mass * ny * restitution;
    
    // Separate bubbles to prevent overlap
    const overlap = (bubble1.size + bubble2.size) / 2 * 0.015 - distance;
    if (overlap > 0) {
      const separationX = (overlap / 2) * nx;
      const separationY = (overlap / 2) * ny;
      
      bubble1.x += separationX;
      bubble1.y += separationY;
      bubble2.x -= separationX;
      bubble2.y -= separationY;
    }
  }, []);

  const updatePhysics = useCallback((deltaTime: number) => {
    const bubbles = Array.from(physicsRef.current.values());
    
    // Update positions based on velocity
    bubbles.forEach(bubble => {
      bubble.x += bubble.velocityX * deltaTime * 0.1;
      bubble.y += bubble.velocityY * deltaTime * 0.1;
      
      // Boundary collision with damping
      if (bubble.x <= 5 || bubble.x >= 95) {
        bubble.velocityX *= -0.8;
        bubble.x = Math.max(5, Math.min(95, bubble.x));
      }
      if (bubble.y <= 5 || bubble.y >= 95) {
        bubble.velocityY *= -0.8;
        bubble.y = Math.max(5, Math.min(95, bubble.y));
      }
      
      // Apply air resistance
      bubble.velocityX *= 0.999;
      bubble.velocityY *= 0.999;
    });
    
    // Check collisions between all bubble pairs
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        if (checkCollision(bubbles[i], bubbles[j])) {
          resolveCollision(bubbles[i], bubbles[j]);
        }
      }
    }
    
    return bubbles;
  }, [checkCollision, resolveCollision]);

  const getBubblePhysics = useCallback((id: number): BubblePhysics | undefined => {
    return physicsRef.current.get(id);
  }, []);

  const removeBubble = useCallback((id: number) => {
    physicsRef.current.delete(id);
  }, []);

  const clearPhysics = useCallback(() => {
    physicsRef.current.clear();
  }, []);

  return {
    initializeBubble,
    updatePhysics,
    getBubblePhysics,
    removeBubble,
    clearPhysics
  };
};
