
import { useState, useEffect } from 'react';

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

  const getAnimationKeyframes = () => {
    switch (bubble.animationType) {
      case 'float':
        return `
          @keyframes float-${bubble.id} {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(${bubble.velocityX * 10}px); }
            50% { transform: translateY(-30px) translateX(${bubble.velocityX * 15}px); }
            75% { transform: translateY(-15px) translateX(${bubble.velocityX * 5}px); }
          }
        `;
      case 'spiral':
        return `
          @keyframes spiral-${bubble.id} {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-15px) translateX(15px) rotate(90deg); }
            50% { transform: translateY(-25px) translateX(0px) rotate(180deg); }
            75% { transform: translateY(-15px) translateX(-15px) rotate(270deg); }
            100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
          }
        `;
      case 'bounce':
        return `
          @keyframes bounce-${bubble.id} {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(-25px) scaleY(0.8); }
          }
        `;
      case 'drift':
        return `
          @keyframes drift-${bubble.id} {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            33% { transform: translateX(${bubble.velocityX * 20}px) translateY(-10px); }
            66% { transform: translateX(-${bubble.velocityX * 10}px) translateY(-5px); }
          }
        `;
      default:
        return '';
    }
  };

  return (
    <>
      <style>
        {getAnimationKeyframes()}
      </style>
      
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
        <div 
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), ${bubble.color})`,
            boxShadow: `
              inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, 0.6),
              0 0 ${bubble.size * 0.2}px ${bubble.color},
              0 ${bubble.size * 0.1}px ${bubble.size * 0.2}px rgba(0, 0, 0, 0.1)
            `,
            backdropFilter: 'blur(1px)',
            border: `1px solid rgba(255, 255, 255, 0.3)`,
          }}
        >
          {/* Primary highlight */}
          <div 
            style={{
              position: 'absolute',
              width: '40%',
              height: '15%',
              background: 'rgba(255, 255, 255, 0.9)',
              top: '20%',
              left: '25%',
              borderRadius: '50%',
              transform: 'rotate(-20deg)',
              filter: 'blur(1px)',
            }}
          />
          
          {/* Secondary highlight */}
          <div 
            style={{
              position: 'absolute',
              width: '20%',
              height: '8%',
              background: 'rgba(255, 255, 255, 0.7)',
              top: '60%',
              left: '60%',
              borderRadius: '50%',
              transform: 'rotate(30deg)',
              filter: 'blur(0.5px)',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Bubble;
