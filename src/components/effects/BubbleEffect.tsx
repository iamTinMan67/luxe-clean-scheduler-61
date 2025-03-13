
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
  
  // Generate initial bubbles
  useEffect(() => {
    const initialBubbles: Bubble[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      size: Math.random() * 60 + 20,
      velocity: { 
        x: (Math.random() - 0.5) * 0.5, 
        y: (Math.random() - 0.5) * 0.5 
      },
      opacity: Math.random() * 0.3 + 0.1,
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
  
  // Animation loop
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
            
            // Apply gentle force away from mouse when close
            let newVelocityX = bubble.velocity.x;
            let newVelocityY = bubble.velocity.y;
            
            if (distance < 200) {
              const repulsionStrength = 0.05;
              const repulsionForceX = (dx / distance) * repulsionStrength;
              const repulsionForceY = (dy / distance) * repulsionStrength;
              
              newVelocityX -= repulsionForceX;
              newVelocityY -= repulsionForceY;
            }
            
            // Apply drag force
            newVelocityX *= 0.99;
            newVelocityY *= 0.99;
            
            // Calculate new position
            let newX = bubble.x + newVelocityX * (deltaTime / 16);
            let newY = bubble.y + newVelocityY * (deltaTime / 16);
            
            // Boundary check
            if (newX < 0 || newX > window.innerWidth) {
              newVelocityX = -newVelocityX;
              newX = bubble.x;
            }
            
            if (newY < 0 || newY > window.innerHeight) {
              newVelocityY = -newVelocityY;
              newY = bubble.y;
            }
            
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
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
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
            scale: [1, 1.02, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 10, damping: 20 },
            y: { type: "spring", stiffness: 10, damping: 20 },
            scale: { 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2 + Math.random() * 3 
            },
          }}
        />
      ))}
    </div>
  );
};

export default BubbleEffect;
