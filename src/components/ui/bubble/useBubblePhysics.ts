
import { useEffect, useState, useRef } from 'react';
import { Bubble } from './types';

export const useBubblePhysics = (bubbleCount: number) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationRef = useRef<number>();
  const bubblesRef = useRef<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 90 + 5, // Keep bubbles away from edges
          y: Math.random() * 90 + 5,
          vx: (Math.random() - 0.5) * 0.3, // Reduced speed for less animation
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 40 + 30, // Slightly larger bubbles
          hue: Math.random() * 60 + 180 // Blue to cyan range for soap bubble effect
        });
      }
      setBubbles(newBubbles);
      bubblesRef.current = newBubbles;
    };

    generateBubbles();
  }, [bubbleCount]);

  useEffect(() => {
    const animate = () => {
      const newBubbles = bubblesRef.current.map(bubble => {
        let { x, y, vx, vy } = bubble;
        
        // Update position
        x += vx;
        y += vy;
        
        // Bounce off walls with some energy loss
        if (x <= 0 || x >= 100) {
          vx = -vx * 0.8;
          x = Math.max(0, Math.min(100, x));
        }
        if (y <= 0 || y >= 100) {
          vy = -vy * 0.8;
          y = Math.max(0, Math.min(100, y));
        }
        
        return { ...bubble, x, y, vx, vy };
      });

      // Check for bubble collisions
      for (let i = 0; i < newBubbles.length; i++) {
        for (let j = i + 1; j < newBubbles.length; j++) {
          const bubble1 = newBubbles[i];
          const bubble2 = newBubbles[j];
          
          const dx = bubble1.x - bubble2.x;
          const dy = bubble1.y - bubble2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (bubble1.size + bubble2.size) / 20; // Convert px to percentage
          
          if (distance < minDistance && distance > 0) {
            // Calculate collision response
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Relative velocity
            const dvx = bubble1.vx - bubble2.vx;
            const dvy = bubble1.vy - bubble2.vy;
            
            // Relative velocity in collision normal direction
            const dvn = dvx * nx + dvy * ny;
            
            // Only resolve if velocities are separating
            if (dvn > 0) continue;
            
            // Collision impulse
            const impulse = 2 * dvn / 2; // Assuming equal mass
            
            // Update velocities
            bubble1.vx -= impulse * nx;
            bubble1.vy -= impulse * ny;
            bubble2.vx += impulse * nx;
            bubble2.vy += impulse * ny;
            
            // Separate bubbles to prevent overlap
            const overlap = minDistance - distance;
            const separationX = (overlap / 2) * nx;
            const separationY = (overlap / 2) * ny;
            
            bubble1.x += separationX;
            bubble1.y += separationY;
            bubble2.x -= separationX;
            bubble2.y -= separationY;
          }
        }
      }

      bubblesRef.current = newBubbles;
      setBubbles([...newBubbles]);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    if (bubbles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length]);

  return bubbles;
};
