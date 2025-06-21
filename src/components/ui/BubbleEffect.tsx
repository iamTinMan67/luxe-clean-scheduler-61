
import { useBubbleGeneration } from '@/hooks/useBubbleGeneration';
import Bubble from './Bubble';

interface BubbleEffectProps {
  bubbleCount?: number;
  className?: string;
}

const BubbleEffect = ({ bubbleCount = 15, className = "" }: BubbleEffectProps) => {
  const bubbles = useBubbleGeneration(bubbleCount);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-50 ${className}`}>
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} />
      ))}
    </div>
  );
};

export default BubbleEffect;
