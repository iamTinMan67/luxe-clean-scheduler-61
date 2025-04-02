
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  velocity: { x: number; y: number };
  opacity: number;
  hue: number;
}

const BubbleEffect: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Generate more bubbles with varied sizes
  useEffect(() => {
    const initialBubbles: Bubble[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth),
      y: Math.random() * (window.innerHeight),
      size: Math.random() * 120 + 20, // Increased size range for more variety
      velocity: { 
        x: (Math.random() - 0.5) * 1.2, // Increased speed
        y: (Math.random() - 0.5) * 1.2  // Increased speed
      },
      opacity: Math.random() * 0.4 + 0.1, // Varied opacity
      hue: Math.floor(Math.random() * 360)
    }));
    
    setBubbles(initialBubbles);
    
    // Clean up animation frame
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Enhanced animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        
        setBubbles(prevBubbles => 
          prevBubbles.map(bubble => {
            // Calculate distance from mouse
            const dx = mousePosition.x - bubble.x;
            const dy = mousePosition.y - bubble.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply stronger repulsion force when mouse is close
            let newVelocityX = bubble.velocity.x;
            let newVelocityY = bubble.velocity.y;
            
            if (distance < 350) {  // Increased detection range even more
              const repulsionStrength = 0.3;  // Increased strength for more bounce
              const repulsionForceX = (dx / distance) * repulsionStrength;
              const repulsionForceY = (dy / distance) * repulsionStrength;
              
              newVelocityX -= repulsionForceX;
              newVelocityY -= repulsionForceY;
            }
            
            // Apply less drag for more persistent movement
            newVelocityX *= 0.99;  
            newVelocityY *= 0.99;
            
            // Add a small random movement for more natural motion
            newVelocityX += (Math.random() - 0.5) * 0.03;
            newVelocityY += (Math.random() - 0.5) * 0.03;
            
            // Calculate new position with increased speed
            let newX = bubble.x + newVelocityX * (deltaTime / 12); // Increased speed
            let newY = bubble.y + newVelocityY * (deltaTime / 12); // Increased speed
            
            // Wrap around boundaries instead of bouncing for continuous flow
            if (newX < -bubble.size) newX = window.innerWidth + bubble.size;
            if (newX > window.innerWidth + bubble.size) newX = -bubble.size;
            if (newY < -bubble.size) newY = window.innerHeight + bubble.size;
            if (newY > window.innerHeight + bubble.size) newY = -bubble.size;
            
            return {
              ...bubble,
              x: newX,
              y: newY,
              velocity: { x: newVelocityX, y: newVelocityY }
            };
          })
        );
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mousePosition]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" // Changed z-index to 0 to be behind content
      aria-hidden="true"
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full glass-morphism"
          style={{
            width: bubble.size,
            height: bubble.size,
            x: bubble.x,
            y: bubble.y,
            opacity: bubble.opacity,
            background: `linear-gradient(135deg, hsla(${bubble.hue}, 100%, 80%, 0.4), hsla(${bubble.hue + 40}, 100%, 80%, 0.1))`,
            boxShadow: `
              inset 0 0 15px hsla(${bubble.hue}, 100%, 95%, 0.5),
              0 0 10px hsla(${bubble.hue}, 100%, 90%, 0.3)
            `,
            border: `1px solid hsla(${bubble.hue}, 100%, 90%, 0.5)`
          }}
          initial={false}
          animate={{
            x: bubble.x,
            y: bubble.y,
            scale: [1, 1.02, 0.98, 1], // Add subtle pulsing animation
          }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              ease: "easeInOut"
            },
            type: "spring",
            stiffness: 30,
            damping: 10,
            mass: 0.8
          }}
        />
      ))}
    </div>
  );
};

export default BubbleEffect;
