
import BubbleHighlights from './BubbleHighlights';

interface BubbleStylesProps {
  bubble: {
    size: number;
    color: string;
  };
}

const BubbleStyles = ({ bubble }: BubbleStylesProps) => {
  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), ${bubble.color})`,
        boxShadow: `
          inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, 0.6),
          0 0 ${bubble.size * 0.2}px ${bubble.color},
          0 ${bubble.size * 0.1}px ${bubble.size * 0.2}px rgba(0, 0, 0, 0.1)
        `,
        backdropFilter: 'blur(1px)',
        border: `1px solid rgba(255, 255, 255, 0.3)`,
      }}
    >
      <BubbleHighlights />
    </div>
  );
};

export default BubbleStyles;
