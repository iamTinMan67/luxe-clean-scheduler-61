
import { useState, useCallback, useEffect } from 'react';
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
  interactive?: boolean;
}

const BubbleEffect = ({ 
  bubbleCount = 8, // Reduced for better performance
  className = "",
  interactive = true 
}: BubbleEffectProps) => {
  const bubbles = useBubbleGeneration(bubbleCount);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [interactive]);

  const getBubbleRepulsion = useCallback((bubble: any) => {
    if (!interactive) return {};
    
    const dx = bubble.x - mousePosition.x;
    const dy = bubble.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 12;
    
    if (distance < repulsionRadius && distance > 0) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      const repulsionX = (dx / distance) * force * 3;
      const repulsionY = (dy / distance) * force * 3;
      
      return {
        transform: `translate(${repulsionX}%, ${repulsionY}%) scale(${1 + force * 0.1})`,
        transition: 'transform 0.2s ease-out',
      };
    }
    
    return {
      transition: 'transform 0.4s ease-out',
    };
  }, [mousePosition, interactive]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 10 }} // Above page content but below navbar (z-index 50)
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            zIndex: 10,
            ...getBubbleRepulsion(bubble)
          }}
        >
          <Bubble bubble={bubble} />
        </div>
      ))}
    </div>
  );
};

export default BubbleEffect;
