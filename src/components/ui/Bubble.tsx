
import { useState, useEffect } from 'react';
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
    animationType: 'float' | 'spiral' | 'bounce' | 'drift';
    velocityX: number;
    velocityY: number;
    opacity: number;
    layer: number;
  };
}

const Bubble = ({ bubble }: BubbleProps) => {
  const [shouldPop, setShouldPop] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const popChance = Math.random();
    if (popChance < 0.05) { // 5% chance to pop
      const popTime = Math.random() * bubble.duration * 1000 + bubble.delay * 1000;
      const timer = setTimeout(() => {
        setShouldPop(true);
        setTimeout(() => setIsVisible(false), 300);
      }, popTime);
      
      return () => clearTimeout(timer);
    }
  }, [bubble.duration, bubble.delay]);

  if (!isVisible) return null;

  return (
    <>
      <BubbleAnimations bubble={bubble} />
      
      <div
        className={`absolute pointer-events-none transition-all duration-300 ${
          shouldPop ? 'animate-pop' : ''
        }`}
        style={{
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          opacity: bubble.opacity,
          zIndex: 50 + bubble.layer,
          animation: `${bubble.animationType}-${bubble.id} ${bubble.duration}s ease-in-out infinite`,
          animationDelay: `${bubble.delay}s`,
        }}
      >
        <BubbleStyles bubble={bubble} />
      </div>
    </>
  );
};

export default Bubble;
