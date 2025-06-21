
import { useBubblePhysics } from './bubble/useBubblePhysics';
import BubbleItem from './bubble/BubbleItem';
import { BubbleEffectProps } from './bubble/types';

const BubbleEffect = ({ bubbleCount = 15, className = "" }: BubbleEffectProps) => {
  const bubbles = useBubblePhysics(bubbleCount);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}>
      {bubbles.map((bubble) => (
        <BubbleItem key={bubble.id} bubble={bubble} />
      ))}
    </div>
  );
};

export default BubbleEffect;
