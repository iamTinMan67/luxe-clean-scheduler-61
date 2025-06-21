
import { useEffect, useState, useRef } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
}

const BubbleEffect = ({ bubbleCount = 15, className = "" }: BubbleEffectProps) => {
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

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble absolute"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))`,
            boxShadow: `
              inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, 0.2),
              0 0 ${bubble.size * 0.2}px rgba(255, 255, 255, 0.1)
            `,
            borderRadius: '50%',
            backdropFilter: 'blur(1px)',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            transform: 'translateZ(0)', // Hardware acceleration
          }}
        >
          {/* Primary highlight */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '25%',
              height: '15%',
              background: 'rgba(255, 255, 255, 0.3)',
              top: '15%',
              left: '25%',
              transform: 'rotate(-20deg)',
              filter: 'blur(1px)',
            }}
          />
          {/* Secondary highlight */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '15%',
              height: '10%',
              background: 'rgba(255, 255, 255, 0.2)',
              top: '35%',
              left: '15%',
              transform: 'rotate(-45deg)',
              filter: 'blur(0.5px)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BubbleEffect;
