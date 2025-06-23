
import { useEffect, useState, useCallback, useRef } from 'react';

interface Bubble {
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
}

export const useBubbleGeneration = (bubbleCount: number = 8) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationFrameRef = useRef<number>();

  const colors = [
    'rgba(255, 182, 193, 0.6)', // Light pink
    'rgba(173, 216, 230, 0.6)', // Light blue
    'rgba(152, 251, 152, 0.6)', // Light green
    'rgba(255, 218, 185, 0.6)', // Peach
    'rgba(221, 160, 221, 0.6)', // Plum
    'rgba(255, 255, 224, 0.6)', // Light yellow
  ];

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 40 + 15; // 15-55px
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const bubble: Bubble = {
        id: i,
        x: Math.random() * 90 + 5, // 5-95% to avoid edges
        y: Math.random() * 90 + 5, // 5-95% to avoid edges
        size,
        duration: Math.random() * 3 + 4, // 4-7s
        delay: Math.random() * 2, // 0-2s delay
        color,
        animationType: 'float',
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.4, // 0.4-0.7 opacity
        layer: 1
      };
      
      newBubbles.push(bubble);
    }
    
    setBubbles(newBubbles);
  }, [bubbleCount]);

  useEffect(() => {
    generateBubbles();
    
    const interval = setInterval(() => {
      generateBubbles();
    }, 20000); // Regenerate every 20 seconds
    
    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [generateBubbles]);

  return bubbles;
};
