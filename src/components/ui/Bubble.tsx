
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
  const [isColliding, setIsColliding] = useState(false);

  useEffect(() => {
    const popChance = Math.random();
    if (popChance < 0.03) { // 3% chance to pop
      const popTime = Math.random() * bubble.duration * 1000 + bubble.delay * 1000;
      const timer = setTimeout(() => {
        setShouldPop(true);
        setTimeout(() => setIsVisible(false), 300);
      }, popTime);
      
      return () => clearTimeout(timer);
    }
  }, [bubble.duration, bubble.delay]);

  // Add collision visual feedback
  useEffect(() => {
    const velocity = Math.sqrt(bubble.velocityX * bubble.velocityX + bubble.velocityY * bubble.velocityY);
    if (velocity > 2) {
      setIsColliding(true);
      const timer = setTimeout(() => setIsColliding(false), 200);
      return () => clearTimeout(timer);
    }
  }, [bubble.velocityX, bubble.velocityY]);

  if (!isVisible) return null;

  const dynamicScale = isColliding ? 1.1 : 1;
  const dynamicOpacity = isColliding ? Math.min(1, bubble.opacity + 0.2) : bubble.opacity;

  return (
    <>
      <BubbleAnimations bubble={bubble} />
      
      <div
        className={`absolute pointer-events-none transition-all duration-200 ${
          shouldPop ? 'animate-pop' : ''
        } ${isColliding ? 'animate-pulse' : ''}`}
        style={{
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          opacity: dynamicOpacity,
          zIndex: 50 + bubble.layer,
          transform: `scale(${dynamicScale})`,
          animation: shouldPop 
            ? `pop-${bubble.id} 0.3s ease-out forwards`
            : `${bubble.animationType}-${bubble.id} ${bubble.duration}s ease-in-out infinite`,
          animationDelay: `${bubble.delay}s`,
        }}
      >
        <BubbleStyles 
          bubble={{
            ...bubble,
            size: bubble.size * dynamicScale
          }} 
        />
        
        {/* Collision spark effect */}
        {isColliding && (
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)`,
              animation: 'ping 0.2s ease-out',
            }}
          />
        )}
      </div>
    </>
  );
};

export default Bubble;
