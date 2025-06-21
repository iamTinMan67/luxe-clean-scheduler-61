
import React from "react";
import { BubbleType } from "@/types/bubble";

interface BubbleProps {
  bubble: BubbleType;
}

const Bubble: React.FC<BubbleProps> = ({ bubble }) => {
  const bubbleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${bubble.x}px`,
    top: `${bubble.y}px`,
    width: `${bubble.size}px`,
    height: `${bubble.size}px`,
    background: `radial-gradient(circle at 30% 30%, 
      hsla(${bubble.hue}, 70%, 80%, ${bubble.opacity * 0.9}), 
      hsla(${bubble.hue}, 50%, 60%, ${bubble.opacity * 0.7}),
      hsla(${bubble.hue}, 30%, 40%, ${bubble.opacity * 0.3}))`,
    borderRadius: '50%',
    backdropFilter: 'blur(1px)',
    border: `1px solid hsla(${bubble.hue}, 60%, 70%, ${bubble.opacity * 0.5})`,
    boxShadow: `
      inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${bubble.size * 0.2}px hsla(0, 0%, 100%, ${bubble.opacity * 0.8}),
      inset -${bubble.size * 0.05}px -${bubble.size * 0.05}px ${bubble.size * 0.1}px hsla(${bubble.hue}, 50%, 30%, ${bubble.opacity * 0.3}),
      0 ${bubble.size * 0.1}px ${bubble.size * 0.3}px hsla(${bubble.hue}, 50%, 30%, ${bubble.opacity * 0.2})
    `,
    pointerEvents: 'none',
    zIndex: 1
  };

  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '30%',
    height: '10%',
    background: `hsla(0, 0%, 100%, ${bubble.opacity * 0.9})`,
    borderRadius: '50%',
    transform: 'rotate(-45deg)',
    filter: 'blur(1px)'
  };

  return (
    <div style={bubbleStyle}>
      <div style={shimmerStyle} />
    </div>
  );
};

export default Bubble;
