
import { useEffect } from 'react';

interface BubbleAnimationsProps {
  bubble: {
    id: number;
    animationType: 'float' | 'spiral' | 'bounce' | 'drift';
    duration: number;
    velocityX: number;
    velocityY: number;
  };
}

const BubbleAnimations = ({ bubble }: BubbleAnimationsProps) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-${bubble.id} {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        25% {
          transform: translateY(-10px) translateX(5px);
        }
        50% {
          transform: translateY(-15px) translateX(0px);
        }
        75% {
          transform: translateY(-10px) translateX(-5px);
        }
      }
      
      @keyframes pop-${bubble.id} {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: scale(0);
          opacity: 0;
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
