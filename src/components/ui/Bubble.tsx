
import { useState, useEffect, useMemo } from 'react';
import BubbleAnimations from './BubbleAnimations';
import BubbleStyles from './BubbleStyles';

interface BubbleProps {
  bubble: {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
    animationType: 'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway';
    velocityX: number;
    velocityY: number;
    opacity: number;
    layer: number;
    rotationSpeed: number;
    scale: number;
    blurAmount: number;
  };
}

const Bubble = ({ bubble }: BubbleProps) => {
  const [shouldPop, setShouldPop] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Memoize the animation name for performance
  const animationName = useMemo(() => {
    if (shouldPop) return `pop-${bubble.id}`;
    return `${bubble.animationType}-${bubble.id}`;
  }, [bubble.animationType, bubble.id, shouldPop]);

  // Enhanced pop chance based on animation type
  const popChance = useMemo(() => {
    switch (bubble.animationType) {
      case 'pulse': return 0.03; // 3% chance
      case 'bounce': return 0.025; // 2.5% chance  
      case 'spiral': return 0.015; // 1.5% chance
      default: return 0.02; // 2% chance
    }
  }, [bubble.animationType]);

  useEffect(() => {
    const popRoll = Math.random();
    if (popRoll < popChance) {
      const popTime = Math.random() * bubble.duration * 1000 + bubble.delay * 1000;
      const timer = setTimeout(() => {
        setShouldPop(true);
        setTimeout(() => setIsVisible(false), 400); // Slightly longer pop animation
      }, popTime);
      
      return () => clearTimeout(timer);
    }
  }, [bubble.duration, bubble.delay, popChance]);

  if (!isVisible) return null;

  return (
    <>
      <BubbleAnimations bubble={bubble} />
      
      <div
        className="pointer-events-none will-change-transform"
        style={{
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          opacity: bubble.opacity,
          animation: shouldPop 
            ? `pop-${bubble.id} 0.4s ease-out forwards`
            : `${animationName} ${bubble.duration}s ease-in-out infinite`,
          animationDelay: `${bubble.delay}s`,
          zIndex: bubble.layer,
          filter: `blur(${bubble.blurAmount * 0.5}px)`, // Subtle blur for depth
          transition: 'filter 0.3s ease-in-out',
        }}
      >
        <BubbleStyles bubble={bubble} />
      </div>
    </>
  );
};

export default Bubble;
