
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
      @keyframes physics-${bubble.id} {
        0% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(${bubble.velocityX * 10}px, ${bubble.velocityY * 10}px) scale(1.05);
        }
        50% {
          transform: translate(${bubble.velocityX * 15}px, ${bubble.velocityY * 15}px) scale(0.95);
        }
        75% {
          transform: translate(${bubble.velocityX * 8}px, ${bubble.velocityY * 8}px) scale(1.02);
        }
        100% {
          transform: translate(0, 0) scale(1);
        }
      }
      
      @keyframes float-${bubble.id} {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        25% {
          transform: translateY(-${Math.abs(bubble.velocityY) * 20}px) rotate(${bubble.velocityX * 5}deg);
        }
        50% {
          transform: translateY(-${Math.abs(bubble.velocityY) * 30}px) rotate(0deg);
        }
        75% {
          transform: translateY(-${Math.abs(bubble.velocityY) * 20}px) rotate(-${bubble.velocityX * 5}deg);
        }
      }
      
      @keyframes spiral-${bubble.id} {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        25% {
          transform: translate(${bubble.velocityX * 20}px, ${bubble.velocityY * 20}px) rotate(90deg);
        }
        50% {
          transform: translate(0, ${bubble.velocityY * 40}px) rotate(180deg);
        }
        75% {
          transform: translate(-${bubble.velocityX * 20}px, ${bubble.velocityY * 20}px) rotate(270deg);
        }
        100% {
          transform: translate(0, 0) rotate(360deg);
        }
      }
      
      @keyframes bounce-${bubble.id} {
        0%, 100% {
          transform: translateY(0) scaleY(1);
        }
        20% {
          transform: translateY(-${Math.abs(bubble.velocityY) * 15}px) scaleY(1.1);
        }
        40% {
          transform: translateY(${Math.abs(bubble.velocityY) * 5}px) scaleY(0.9);
        }
        60% {
          transform: translateY(-${Math.abs(bubble.velocityY) * 10}px) scaleY(1.05);
        }
        80% {
          transform: translateY(${Math.abs(bubble.velocityY) * 3}px) scaleY(0.95);
        }
      }
      
      @keyframes drift-${bubble.id} {
        0% {
          transform: translate(0, 0);
        }
        33% {
          transform: translate(${bubble.velocityX * 25}px, ${bubble.velocityY * 15}px);
        }
        66% {
          transform: translate(-${bubble.velocityX * 15}px, ${bubble.velocityY * 25}px);
        }
        100% {
          transform: translate(0, 0);
        }
      }
      
      @keyframes pop-${bubble.id} {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
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
