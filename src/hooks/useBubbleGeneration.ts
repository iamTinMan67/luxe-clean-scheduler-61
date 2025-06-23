
import { useEffect, useState, useCallback, useRef } from 'react';
import { useBubblePhysics } from './useBubblePhysics';
import { useBubbleCollisions } from './useBubbleCollisions';

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

export const useBubbleGeneration = (bubbleCount: number = 20) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const { 
    initializeBubble, 
    updatePhysics, 
    getBubblePhysics, 
    clearPhysics 
  } = useBubblePhysics();
  const { 
    initializeQuadrants, 
    updateSpatialGrid, 
    getPotentialCollisions 
  } = useBubbleCollisions();
  
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  const colors = [
    'rgba(255, 182, 193, 0.8)', // Light pink
    'rgba(173, 216, 230, 0.8)', // Light blue
    'rgba(152, 251, 152, 0.8)', // Light green
    'rgba(255, 218, 185, 0.8)', // Peach
    'rgba(221, 160, 221, 0.8)', // Plum
    'rgba(255, 255, 224, 0.8)', // Light yellow
    'rgba(176, 224, 230, 0.8)', // Powder blue
    'rgba(255, 192, 203, 0.8)', // Pink
  ];

  const animationTypes: Bubble['animationType'][] = ['float', 'spiral', 'bounce', 'drift'];

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    clearPhysics();
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 60 + 20; // 20-80px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      const layer = Math.floor(Math.random() * 3) + 1;
      
      const bubble: Bubble = {
        id: i,
        x: Math.random() * 80 + 10, // 10-90% to avoid edges
        y: Math.random() * 80 + 10, // 10-90% to avoid edges
        size,
        duration: Math.random() * 4 + 3, // 3-7s
        delay: Math.random() * 2, // 0-2s delay
        color,
        animationType,
        velocityX: (Math.random() - 0.5) * 1, // -0.5 to 0.5
        velocityY: (Math.random() - 0.5) * 1, // -0.5 to 0.5
        opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 opacity
        layer
      };
      
      initializeBubble(bubble);
      newBubbles.push(bubble);
    }
    
    setBubbles(newBubbles);
  }, [bubbleCount, clearPhysics, initializeBubble]);

  const updateBubblePositions = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastUpdateRef.current;
    lastUpdateRef.current = now;
    
    setBubbles(prevBubbles => {
      updateSpatialGrid(prevBubbles);
      const updatedPhysics = updatePhysics(deltaTime);
      
      return prevBubbles.map(bubble => {
        const physics = getBubblePhysics(bubble.id);
        if (physics) {
          return {
            ...bubble,
            x: physics.x,
            y: physics.y,
            velocityX: physics.velocityX,
            velocityY: physics.velocityY
          };
        }
        return bubble;
      });
    });
    
    animationFrameRef.current = requestAnimationFrame(updateBubblePositions);
  }, [updatePhysics, getBubblePhysics, updateSpatialGrid]);

  useEffect(() => {
    initializeQuadrants();
    generateBubbles();
    
    const interval = setInterval(() => {
      generateBubbles();
    }, 15000); // Regenerate every 15 seconds
    
    // Start physics animation loop
    animationFrameRef.current = requestAnimationFrame(updateBubblePositions);
    
    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearPhysics();
    };
  }, [generateBubbles, updateBubblePositions, initializeQuadrants, clearPhysics]);

  return bubbles;
};
