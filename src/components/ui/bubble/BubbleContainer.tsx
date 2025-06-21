
import React from "react";
import { BubbleEffectProps } from "@/types/bubble";
import { useBubbleAnimation } from "@/hooks/useBubbleAnimation";
import Bubble from "./Bubble";

const BubbleContainer: React.FC<BubbleEffectProps> = ({ 
  count = 8, 
  className = "" 
}) => {
  const { bubbles } = useBubbleAnimation(count);

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {bubbles.map(bubble => (
        <Bubble key={bubble.id} bubble={bubble} />
      ))}
    </div>
  );
};

export default BubbleContainer;
