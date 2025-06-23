
interface BubbleHighlightsProps {
  animationType?: 'float' | 'spiral' | 'bounce' | 'drift' | 'pulse' | 'sway';
}

const BubbleHighlights = ({ animationType = 'float' }: BubbleHighlightsProps) => {
  const getHighlightAnimation = () => {
    switch (animationType) {
      case 'pulse':
        return 'pulse 3s ease-in-out infinite';
      case 'spiral':
        return 'spin 8s linear infinite';
      case 'sway':
        return 'float 4s ease-in-out infinite';
      default:
        return 'none';
    }
  };

  return (
    <>
      {/* Primary highlight - enhanced based on animation type */}
      <div 
        style={{
          position: 'absolute',
          width: animationType === 'pulse' ? '50%' : '40%',
          height: animationType === 'pulse' ? '20%' : '15%',
          background: animationType === 'spiral' 
            ? 'linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))'
            : 'rgba(255, 255, 255, 0.9)',
          top: '20%',
          left: '25%',
          borderRadius: '50%',
          transform: 'rotate(-20deg)',
          filter: 'blur(1px)',
          animation: getHighlightAnimation(),
        }}
      />
      
      {/* Secondary highlight */}
      <div 
        style={{
          position: 'absolute',
          width: '20%',
          height: '8%',
          background: 'rgba(255, 255, 255, 0.7)',
          top: '60%',
          left: '60%',
          borderRadius: '50%',
          transform: 'rotate(30deg)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* Tertiary highlight for enhanced bubbles */}
      {(animationType === 'spiral' || animationType === 'pulse') && (
        <div 
          style={{
            position: 'absolute',
            width: '15%',
            height: '6%',
            background: 'rgba(255, 255, 255, 0.5)',
            top: '40%',
            left: '70%',
            borderRadius: '50%',
            transform: 'rotate(-45deg)',
            filter: 'blur(0.8px)',
          }}
        />
      )}
    </>
  );
};

export default BubbleHighlights;
