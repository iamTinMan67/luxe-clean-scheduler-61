
import { useEffect } from 'react';

interface BubbleAnimationsProps {
  bubble: {
    id: number;
    animationType: 'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway';
    duration: number;
    velocityX: number;
    velocityY: number;
    rotationSpeed: number;
    layer: number;
  };
}

const BubbleAnimations = ({ bubble }: BubbleAnimationsProps) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-${bubble.id} {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(1);
        }
        25% {
          transform: translateY(-15px) translateX(8px) scale(1.02);
        }
        50% {
          transform: translateY(-25px) translateX(0px) scale(0.98);
        }
        75% {
          transform: translateY(-15px) translateX(-8px) scale(1.02);
        }
      }
      
      @keyframes spiral-${bubble.id} {
        0% {
          transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
        }
        25% {
          transform: translateY(-10px) translateX(15px) rotate(90deg) scale(1.1);
        }
        50% {
          transform: translateY(-20px) translateX(0px) rotate(180deg) scale(0.9);
        }
        75% {
          transform: translateY(-10px) translateX(-15px) rotate(270deg) scale(1.1);
        }
        100% {
          transform: translateY(0px) translateX(0px) rotate(360deg) scale(1);
        }
      }
      
      @keyframes bounce-${bubble.id} {
        0%, 100% {
          transform: translateY(0px) scale(1);
        }
        50% {
          transform: translateY(-30px) scale(1.1);
        }
      }
      
      @keyframes drift-${bubble.id} {
        0% {
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-10px) translateX(20px) scale(1.05);
          opacity: 1;
        }
        100% {
          transform: translateY(-5px) translateX(40px) scale(0.95);
          opacity: 0.6;
        }
      }
      
      @keyframes pulse-${bubble.id} {
        0%, 100% {
          transform: scale(1);
          opacity: 0.6;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.9;
        }
      }
      
      @keyframes sway-${bubble.id} {
        0%, 100% {
          transform: translateX(0px) rotate(0deg) scale(1);
        }
        33% {
          transform: translateX(10px) rotate(2deg) scale(1.02);
        }
        66% {
          transform: translateX(-10px) rotate(-2deg) scale(0.98);
        }
      }
      
      @keyframes pop-${bubble.id} {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.4);
          opacity: 0.8;
          filter: blur(3px);
        }
        100% {
          transform: scale(0);
          opacity: 0;
          filter: blur(5px);
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [bubble]);

  return null;
};

export default BubbleAnimations;
