
import { useEffect, useState, useCallback } from 'react';

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
  layer: number; // For parallax effect
}

export const useBubbleGeneration = (bubbleCount: number = 20) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const colors = [
    'rgba(255, 182, 193, 0.6)', // Light pink
    'rgba(173, 216, 230, 0.6)', // Light blue
    'rgba(152, 251, 152, 0.6)', // Light green
    'rgba(255, 218, 185, 0.6)', // Peach
    'rgba(221, 160, 221, 0.6)', // Plum
    'rgba(255, 255, 224, 0.6)', // Light yellow
    'rgba(176, 224, 230, 0.6)', // Powder blue
    'rgba(255, 192, 203, 0.6)', // Pink
  ];

  const animationTypes: Bubble['animationType'][] = ['float', 'spiral', 'bounce', 'drift'];

  // Check collision between two bubbles
  const checkCollision = useCallback((bubble1: Bubble, bubble2: Bubble): boolean => {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (bubble1.size + bubble2.size) / 2 / 10; // Convert px to percentage
    return distance < minDistance;
  }, []);

  // Generate position that doesn't collide with existing bubbles
  const generateNonCollidingPosition = useCallback((newBubble: Partial<Bubble>, existingBubbles: Bubble[]): { x: number; y: number } => {
    let attempts = 0;
    let x, y;
    
    do {
      x = Math.random() * 100;
      y = Math.random() * 100;
      attempts++;
      
      const tempBubble = { ...newBubble, x, y } as Bubble;
      const hasCollision = existingBubbles.some(existing => checkCollision(tempBubble, existing));
      
      if (!hasCollision || attempts > 50) { // Max 50 attempts to avoid infinite loop
        break;
      }
    } while (attempts < 50);
    
    return { x, y };
  }, [checkCollision]);

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 80 + 30; // 30-110px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      const layer = Math.floor(Math.random() * 3) + 1; // 1-3 layers for parallax
      
      // Create partial bubble for collision checking
      const partialBubble = {
        size,
        color,
        animationType,
        layer
      };
      
      const { x, y } = generateNonCollidingPosition(partialBubble, newBubbles);
      
      const bubble: Bubble = {
        id: i,
        x,
        y,
        size,
        duration: Math.random() * 8 + 4, // 4-12s (faster than before)
        delay: Math.random() * 3, // 0-3s delay
        color,
        animationType,
        velocityX: (Math.random() - 0.5) * 0.5, // Horizontal drift
        velocityY: (Math.random() - 0.5) * 0.3, // Vertical drift
        opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7 opacity
        layer
      };
      
      newBubbles.push(bubble);
    }
    
    setBubbles(newBubbles);
  }, [bubbleCount, generateNonCollidingPosition]);

  // Regenerate bubbles when they complete their animation cycle
  useEffect(() => {
    generateBubbles();
    
    // Set up regeneration interval
    const interval = setInterval(() => {
      generateBubbles();
    }, 15000); // Regenerate every 15 seconds
    
    return () => clearInterval(interval);
  }, [generateBubbles]);

  return bubbles;
};
