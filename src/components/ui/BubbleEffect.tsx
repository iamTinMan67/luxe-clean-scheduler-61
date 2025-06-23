
import { useState, useCallback, useEffect } from 'react';
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
  interactive?: boolean;
}

const BubbleEffect = ({ 
  bubbleCount = 12, // Reduced count for better performance with physics
  className = "",
  interactive = true 
}: BubbleEffectProps) => {
  const bubbles = useBubbleGeneration(bubbleCount);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Calculate mouse velocity for enhanced interactions
    setMouseVelocity({
      x: x - mousePosition.x,
      y: y - mousePosition.y
    });
    
    setMousePosition({ x, y });
  }, [interactive, mousePosition]);

  const getBubbleRepulsion = useCallback((bubble: any) => {
    if (!interactive) return {};
    
    const dx = bubble.x - mousePosition.x;
    const dy = bubble.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 15;
    
    if (distance < repulsionRadius && distance > 0) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      // Factor in mouse velocity for more dynamic interactions
      const velocityFactor = Math.sqrt(mouseVelocity.x * mouseVelocity.x + mouseVelocity.y * mouseVelocity.y) * 0.1;
      const enhancedForce = force * (1 + velocityFactor);
      
      const repulsionX = (dx / distance) * enhancedForce * 4;
      const repulsionY = (dy / distance) * enhancedForce * 4;
      
      return {
        transform: `translate(${repulsionX}%, ${repulsionY}%) scale(${1 + force * 0.1})`,
        transition: 'transform 0.15s ease-out',
        filter: `brightness(${1 + force * 0.3})`,
      };
    }
    
    return {
      transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
      filter: 'brightness(1)',
    };
  }, [mousePosition, mouseVelocity, interactive]);

  // Performance monitoring
  useEffect(() => {
    const logPerformance = () => {
      console.log(`Bubble Physics: ${bubbles.length} bubbles active`);
    };
    
    const interval = setInterval(logPerformance, 5000);
    return () => clearInterval(interval);
  }, [bubbles.length]);

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
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs text-white/50 pointer-events-auto">
          <div>Bubbles: {bubbles.length}</div>
          <div>Mouse: {mousePosition.x.toFixed(1)}, {mousePosition.y.toFixed(1)}</div>
          <div>Velocity: {mouseVelocity.x.toFixed(2)}, {mouseVelocity.y.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default BubbleEffect;
