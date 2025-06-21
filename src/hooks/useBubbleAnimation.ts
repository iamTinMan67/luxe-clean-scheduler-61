
import { useState, useEffect, useCallback, useRef } from "react";
import { BubbleType } from "@/types/bubble";
import { 
  createBubble, 
  updateBubblePosition, 
  checkBubbleCollision, 
  resolveBubbleCollision 
} from "@/utils/bubblePhysics";

export const useBubbleAnimation = (count: number = 8) => {
  const [bubbles, setBubbles] = useState<BubbleType[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();

  const updateWindowSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const initializeBubbles = useCallback(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;
    
    const newBubbles = Array.from({ length: count }, (_, i) => 
      createBubble(i, windowSize.width, windowSize.height)
    );
    setBubbles(newBubbles);
  }, [count, windowSize.width, windowSize.height]);

  const animateBubbles = useCallback(() => {
    setBubbles(prevBubbles => {
      if (windowSize.width === 0 || windowSize.height === 0) return prevBubbles;
      
      let updatedBubbles = prevBubbles.map(bubble => 
        updateBubblePosition(bubble, windowSize.width, windowSize.height)
      );

      // Handle collisions
      for (let i = 0; i < updatedBubbles.length; i++) {
        for (let j = i + 1; j < updatedBubbles.length; j++) {
          if (checkBubbleCollision(updatedBubbles[i], updatedBubbles[j])) {
            const [bubble1, bubble2] = resolveBubbleCollision(updatedBubbles[i], updatedBubbles[j]);
            updatedBubbles[i] = bubble1;
            updatedBubbles[j] = bubble2;
          }
        }
      }

      return updatedBubbles;
    });

    animationFrameRef.current = requestAnimationFrame(animateBubbles);
  }, [windowSize.width, windowSize.height]);

  useEffect(() => {
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, [updateWindowSize]);

  useEffect(() => {
    initializeBubbles();
  }, [initializeBubbles]);

  useEffect(() => {
    if (bubbles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateBubbles);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bubbles.length, animateBubbles]);

  return { bubbles, windowSize };
};
