
interface BubbleProps {
  bubble: {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  };
}

const Bubble = ({ bubble }: BubbleProps) => {
  return (
    <div
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
  );
};

export default Bubble;
