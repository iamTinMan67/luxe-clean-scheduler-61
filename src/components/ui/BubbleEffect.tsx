
import { useState, useCallback } from 'react';
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
  interactive?: boolean;
}

const BubbleEffect = ({ 
  bubbleCount = 15, 
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
        transform: `translate(${repulsionX}%, ${repulsionY}%)`,
        transition: 'transform 0.2s ease-out',
      };
    }
    
    return {
      transition: 'transform 0.3s ease-out',
    };
  }, [mousePosition, interactive]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}
      onMouseMove={handleMouseMove}
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={getBubbleRepulsion(bubble)}
          className="absolute"
        >
          <Bubble bubble={bubble} />
        </div>
      ))}
    </div>
  );
};

export default BubbleEffect;
