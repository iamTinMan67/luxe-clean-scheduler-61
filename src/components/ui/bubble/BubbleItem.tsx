
import { Bubble } from './types';

interface BubbleItemProps {
  bubble: Bubble;
}

const BubbleItem = ({ bubble }: BubbleItemProps) => {
  return (
    <div
      className="bubble absolute"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))`,
        boxShadow: `
          inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, 0.2),
          0 0 ${bubble.size * 0.2}px rgba(255, 255, 255, 0.1)
        `,
        borderRadius: '50%',
        backdropFilter: 'blur(1px)',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        transform: 'translateZ(0)', // Hardware acceleration
      }}
    >
      {/* Primary highlight */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '25%',
          height: '15%',
          background: 'rgba(255, 255, 255, 0.3)',
          top: '15%',
          left: '25%',
          transform: 'rotate(-20deg)',
          filter: 'blur(1px)',
        }}
      />
      {/* Secondary highlight */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '15%',
          height: '10%',
          background: 'rgba(255, 255, 255, 0.2)',
          top: '35%',
          left: '15%',
          transform: 'rotate(-45deg)',
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
};

export default BubbleItem;
