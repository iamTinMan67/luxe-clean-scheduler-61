
import BubbleHighlights from './BubbleHighlights';

interface BubbleStylesProps {
  bubble: {
    size: number;
    color: string;
    layer: number;
    scale: number;
    blurAmount: number;
    animationType: 'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway';
  };
}

const BubbleStyles = ({ bubble }: BubbleStylesProps) => {
  // Enhanced gradients based on animation type
  const getGradientStyle = () => {
    const baseGradient = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${bubble.color})`;
    
    switch (bubble.animationType) {
      case 'pulse':
        return `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9), ${bubble.color}, rgba(0, 0, 0, 0.1))`;
      case 'spiral':
        return `conic-gradient(from 0deg, ${bubble.color}, rgba(255, 255, 255, 0.6), ${bubble.color})`;
      case 'bounce':
        return `radial-gradient(ellipse at 40% 20%, rgba(255, 255, 255, 0.9), ${bubble.color})`;
      default:
        return baseGradient;
    }
  };

  // Enhanced shadow based on layer
  const getLayerShadow = () => {
    const baseShadow = `0 0 ${bubble.size * 0.3}px ${bubble.color}`;
    const layerShadow = `0 ${bubble.layer * 2}px ${bubble.layer * 4}px rgba(0, 0, 0, 0.1)`;
    const glowShadow = `inset 0 0 ${bubble.size * 0.4}px rgba(255, 255, 255, 0.7)`;
    
    return `${glowShadow}, ${baseShadow}, ${layerShadow}`;
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: getGradientStyle(),
        boxShadow: getLayerShadow(),
        backdropFilter: `blur(${bubble.blurAmount}px)`,
        border: `1px solid rgba(255, 255, 255, 0.4)`,
        transform: `scale(${bubble.scale})`,
        transition: 'transform 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BubbleHighlights animationType={bubble.animationType} />
      
      {/* Additional shimmer effect for certain animation types */}
      {(bubble.animationType === 'spiral' || bubble.animationType === 'pulse') && (
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
            animation: `pulse 2s ease-in-out infinite`,
          }}
        />
      )}
    </div>
  );
};

export default BubbleStyles;
