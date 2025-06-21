
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const useBubbleGeneration = (bubbleCount: number = 15) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 10
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, [bubbleCount]);

  return bubbles;
};
