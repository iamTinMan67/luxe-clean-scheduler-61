
import { useEffect, useState, useCallback, useRef } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  animationType: 'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway';
  velocityX: number;
  velocityY: number;
  opacity: number;
  layer: number;
  rotationSpeed: number;
  scale: number;
  blurAmount: number;
}

export const useBubbleGeneration = (bubbleCount: number = 20) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationFrameRef = useRef<number>();
  const lastGenerationRef = useRef<number>(Date.now());

  const colors = [
    'rgba(255, 182, 193, 0.3)', // Light pink - more transparent
    'rgba(173, 216, 230, 0.3)', // Light blue - more transparent
    'rgba(152, 251, 152, 0.3)', // Light green - more transparent
    'rgba(255, 218, 185, 0.3)', // Peach - more transparent
    'rgba(221, 160, 221, 0.3)', // Plum - more transparent
    'rgba(255, 255, 224, 0.3)', // Light yellow - more transparent
    'rgba(230, 230, 250, 0.3)', // Lavender - more transparent
    'rgba(240, 248, 255, 0.3)', // Alice blue - more transparent
    'rgba(255, 239, 213, 0.3)', // Papaya whip - more transparent
    'rgba(245, 245, 220, 0.3)', // Beige - more transparent
  ];

  const animationTypes: Array<'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway'> = [
    'float', 'spiral', 'bounce', 'drift', 'pulse', 'sway'
  ];

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 60 + 20; // 20-80px for more variety
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      const layer = Math.floor(Math.random() * 3) + 1; // 3 layers
      
      const bubble: Bubble = {
        id: Date.now() + i,
        x: Math.random() * 90 + 5, // 5-95% to avoid edges
        y: Math.random() * 90 + 5, // 5-95% to avoid edges
        size,
        duration: Math.random() * 2 + 2, // 2-4s for faster animations
        delay: Math.random() * 1, // 0-1s delay for staggered appearance
        color,
        animationType,
        velocityX: (Math.random() - 0.5) * 1.5, // Increased velocity range
        velocityY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 opacity for more translucency
        layer,
        rotationSpeed: (Math.random() - 0.5) * 2, // Rotation for spiral effect
        scale: Math.random() * 0.5 + 0.75, // 0.75-1.25 scale variation
        blurAmount: Math.random() * 2 + 0.5, // 0.5-2.5px blur for depth
      };
      
      newBubbles.push(bubble);
    }
    
    setBubbles(newBubbles);
    lastGenerationRef.current = Date.now();
  }, [bubbleCount]);

  const updateBubblePositions = useCallback(() => {
    setBubbles(prevBubbles => 
      prevBubbles.map(bubble => {
        let newX = bubble.x;
        let newY = bubble.y;
        
        // Apply different movement patterns based on animation type
        switch (bubble.animationType) {
          case 'drift':
            newX += bubble.velocityX * 0.1;
            newY += bubble.velocityY * 0.1;
            break;
          case 'spiral':
            const time = Date.now() * 0.001;
            newX += Math.sin(time * bubble.rotationSpeed) * 0.5;
            newY += Math.cos(time * bubble.rotationSpeed) * 0.3;
            break;
          case 'bounce':
            if (newX <= 5 || newX >= 95) bubble.velocityX *= -1;
            if (newY <= 5 || newY >= 95) bubble.velocityY *= -1;
            newX += bubble.velocityX * 0.2;
            newY += bubble.velocityY * 0.2;
            break;
          case 'sway':
            newX += Math.sin(Date.now() * 0.002 + bubble.id) * 0.3;
            newY += bubble.velocityY * 0.05;
            break;
          case 'pulse':
            // Pulsing bubbles stay mostly in place with slight movement
            newX += bubble.velocityX * 0.05;
            newY += bubble.velocityY * 0.05;
            break;
          default: // float
            newX += bubble.velocityX * 0.08;
            newY += bubble.velocityY * 0.08;
        }
        
        // Wrap around screen edges
        if (newX < -5) newX = 105;
        if (newX > 105) newX = -5;
        if (newY < -5) newY = 105;
        if (newY > 105) newY = -5;
        
        return {
          ...bubble,
          x: newX,
          y: newY,
        };
      })
    );
  }, []);

  useEffect(() => {
    generateBubbles();
    
    // Reduced regeneration interval for more dynamic effect
    const regenerationInterval = setInterval(() => {
      generateBubbles();
    }, 8000); // Every 8 seconds instead of 20
    
    // Animation loop for smoother movement
    const animationLoop = () => {
      updateBubblePositions();
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    };
    
    animationLoop();
    
    return () => {
      clearInterval(regenerationInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [generateBubbles, updateBubblePositions]);

  return bubbles;
};
