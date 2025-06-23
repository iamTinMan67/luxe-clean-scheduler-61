
interface BubbleAnimationsProps {
  bubble: {
    id: number;
    animationType: 'float' | 'spiral' | 'bounce' | 'drift';
    velocityX: number;
  };
}

const BubbleAnimations = ({ bubble }: BubbleAnimationsProps) => {
  const getAnimationKeyframes = () => {
    switch (bubble.animationType) {
      case 'float':
        return `
          @keyframes float-${bubble.id} {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(${bubble.velocityX * 10}px); }
            50% { transform: translateY(-30px) translateX(${bubble.velocityX * 15}px); }
            75% { transform: translateY(-15px) translateX(${bubble.velocityX * 5}px); }
          }
        `;
      case 'spiral':
        return `
          @keyframes spiral-${bubble.id} {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-15px) translateX(15px) rotate(90deg); }
            50% { transform: translateY(-25px) translateX(0px) rotate(180deg); }
            75% { transform: translateY(-15px) translateX(-15px) rotate(270deg); }
            100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
          }
        `;
      case 'bounce':
        return `
          @keyframes bounce-${bubble.id} {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(-25px) scaleY(0.8); }
          }
        `;
      case 'drift':
        return `
          @keyframes drift-${bubble.id} {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            33% { transform: translateX(${bubble.velocityX * 20}px) translateY(-10px); }
            66% { transform: translateX(-${bubble.velocityX * 10}px) translateY(-5px); }
          }
        `;
      default:
        return '';
    }
  };

  return (
    <style>
      {getAnimationKeyframes()}
    </style>
  );
};

export default BubbleAnimations;
