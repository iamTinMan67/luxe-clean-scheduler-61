
import { useState, useCallback } from 'react';
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
  interactive?: boolean;
}

const BubbleEffect = ({ 
  bubbleCount = 25, 
  className = "",
  interactive = true 
}: BubbleEffectProps) => {
  const bubbles = useBubbleGeneration(bubbleCount);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse interaction for bubble repulsion
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [interactive]);

  // Calculate repulsion effect for each bubble
  const getBubbleRepulsion = useCallback((bubble: any) => {
    if (!interactive) return {};
    
    const dx = bubble.x - mousePosition.x;
    const dy = bubble.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 15; // Percentage
    
    if (distance < repulsionRadius) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      const repulsionX = (dx / distance) * force * 5;
      const repulsionY = (dy / distance) * force * 5;
      
      return {
        transform: `translate(${repulsionX}%, ${repulsionY}%)`,
        transition: 'transform 0.3s ease-out',
      };
    }
    
    return {
      transition: 'transform 0.5s ease-out',
    };
  }, [mousePosition, interactive]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden z-50 ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        }}
      />
      
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
