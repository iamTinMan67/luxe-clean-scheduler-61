
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

  // Handle popping animation
  useEffect(() => {
    const popChance = Math.random();
    if (popChance < 0.1) { // 10% chance to pop
      const popTime = Math.random() * bubble.duration * 1000 + bubble.delay * 1000;
      const timer = setTimeout(() => {
        setShouldPop(true);
        setTimeout(() => setIsVisible(false), 300); // Hide after pop animation
      }, popTime);
      
      return () => clearTimeout(timer);
    }
  }, [bubble.duration, bubble.delay]);

  if (!isVisible) return null;

  // Dynamic animation based on type
  const getAnimationStyle = () => {
    const baseAnimation = `${bubble.animationType}-${bubble.id} ${bubble.duration}s ease-in-out infinite`;
    const delayStyle = `${bubble.delay}s`;
    
    return {
      animation: baseAnimation,
      animationDelay: delayStyle,
    };
  };

  // Parallax effect based on layer
  const getParallaxStyle = () => {
    const parallaxFactor = bubble.layer * 0.1;
    return {
      transform: `translateZ(${bubble.layer * 10}px) scale(${1 + parallaxFactor})`,
    };
  };

  return (
    <>
      <style>
        {`
          @keyframes float-${bubble.id} {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) rotate(0deg); 
            }
            25% { 
              transform: translateY(-${15 + bubble.size * 0.1}px) translateX(${bubble.velocityX * 10}px) rotate(90deg); 
            }
            50% { 
              transform: translateY(-${25 + bubble.size * 0.15}px) translateX(${bubble.velocityX * 15}px) rotate(180deg); 
            }
            75% { 
              transform: translateY(-${10 + bubble.size * 0.05}px) translateX(${bubble.velocityX * 5}px) rotate(270deg); 
            }
          }
          
          @keyframes spiral-${bubble.id} {
            0% { 
              transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            }
            25% { 
              transform: translateY(-${20}px) translateX(${20}px) rotate(90deg) scale(1.1); 
            }
            50% { 
              transform: translateY(-${30}px) translateX(0px) rotate(180deg) scale(0.9); 
            }
            75% { 
              transform: translateY(-${20}px) translateX(-${20}px) rotate(270deg) scale(1.1); 
            }
            100% { 
              transform: translateY(0px) translateX(0px) rotate(360deg) scale(1); 
            }
          }
          
          @keyframes bounce-${bubble.id} {
            0%, 100% { 
              transform: translateY(0px) scaleY(1); 
            }
            50% { 
              transform: translateY(-${30 + bubble.size * 0.2}px) scaleY(0.8); 
            }
          }
          
          @keyframes drift-${bubble.id} {
            0%, 100% { 
              transform: translateX(0px) translateY(0px); 
            }
            33% { 
              transform: translateX(${bubble.velocityX * 25}px) translateY(-${10}px); 
            }
            66% { 
              transform: translateX(-${bubble.velocityX * 15}px) translateY(-${5}px); 
            }
          }
          
          @keyframes pop {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
            100% { transform: scale(0); opacity: 0; }
          }
        `}
      </style>
      
      <div
        className={`bubble absolute pointer-events-none transition-all duration-300 ${
          shouldPop ? 'animate-pop' : ''
        }`}
        style={{
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          opacity: bubble.opacity,
          zIndex: 50 + bubble.layer,
          ...getAnimationStyle(),
          ...getParallaxStyle(),
        }}
      >
        <div 
          className="bubble-body"
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
            backdropFilter: 'blur(2px)',
            border: `1px solid rgba(255, 255, 255, 0.3)`,
          }}
        >
          {/* Primary shimmer */}
          <div 
            className="bubble-shimmer absolute rounded-full"
            style={{
              width: '40%',
              height: '15%',
              background: 'rgba(255, 255, 255, 0.9)',
              top: '20%',
              left: '25%',
              transform: 'rotate(-20deg)',
              filter: 'blur(1px)',
            }}
          />
          
          {/* Secondary shimmer */}
          <div 
            className="bubble-shimmer-2 absolute rounded-full"
            style={{
              width: '20%',
              height: '8%',
              background: 'rgba(255, 255, 255, 0.7)',
              top: '60%',
              left: '60%',
              transform: 'rotate(30deg)',
              filter: 'blur(0.5px)',
            }}
          />
          
          {/* Micro bubbles inside */}
          <div 
            className="micro-bubble absolute rounded-full"
            style={{
              width: '8%',
              height: '8%',
              background: 'rgba(255, 255, 255, 0.6)',
              top: '70%',
              left: '30%',
            }}
          />
          <div 
            className="micro-bubble absolute rounded-full"
            style={{
              width: '5%',
              height: '5%',
              background: 'rgba(255, 255, 255, 0.5)',
              top: '45%',
              left: '70%',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Bubble;
