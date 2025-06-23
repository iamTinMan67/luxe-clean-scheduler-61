
import { useState, useCallback, useMemo } from 'react';
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
  interactive?: boolean;
}

const BubbleEffect = ({ 
  bubbleCount = 20, // Increased default count
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

  // Enhanced repulsion with layer-based effects
  const getBubbleRepulsion = useCallback((bubble: any) => {
    if (!interactive) return {};
    
    const dx = bubble.x - mousePosition.x;
    const dy = bubble.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 15 + (bubble.layer * 2); // Larger radius for higher layers
    
    if (distance < repulsionRadius && distance > 0) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      const layerMultiplier = bubble.layer * 0.5 + 1; // Higher layers move more
      const repulsionX = (dx / distance) * force * 4 * layerMultiplier;
      const repulsionY = (dy / distance) * force * 4 * layerMultiplier;
      
      return {
        transform: `translate(${repulsionX}%, ${repulsionY}%) scale(${1 + force * 0.15})`,
        transition: 'transform 0.3s ease-out',
        filter: `blur(${bubble.blurAmount + force}px)`,
      };
    }
    
    return {
      transition: 'transform 0.5s ease-out, filter 0.3s ease-out',
    };
  }, [mousePosition, interactive]);

  // Group bubbles by layer for better rendering performance
  const bubblesByLayer = useMemo(() => {
    const layers: { [key: number]: typeof bubbles } = {};
    bubbles.forEach(bubble => {
      if (!layers[bubble.layer]) layers[bubble.layer] = [];
      layers[bubble.layer].push(bubble);
    });
    return layers;
  }, [bubbles]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 10 }}
    >
      {/* Render bubbles layer by layer for proper depth */}
      {Object.entries(bubblesByLayer)
        .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Sort by layer
        .map(([layer, layerBubbles]) => (
          <div key={layer} style={{ zIndex: 10 + parseInt(layer) }}>
            {layerBubbles.map((bubble) => (
              <div
                key={bubble.id}
                style={{
                  position: 'absolute',
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  zIndex: 10 + bubble.layer,
                  ...getBubbleRepulsion(bubble)
                }}
              >
                <Bubble bubble={bubble} />
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default BubbleEffect;
