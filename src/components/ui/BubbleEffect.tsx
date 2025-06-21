
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
}

const BubbleEffect = ({ bubbleCount = 15, className = "" }: BubbleEffectProps) => {
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

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-50 ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble absolute opacity-20"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            animation: `float ${bubble.duration}s ease-in-out infinite`
          }}
        >
          <div className="bubble-shimmer" />
        </div>
      ))}
    </div>
  );
};

export default BubbleEffect;
