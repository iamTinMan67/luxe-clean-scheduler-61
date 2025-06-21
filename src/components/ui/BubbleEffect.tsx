
import React from "react";
import { BubbleEffectProps } from "@/types/bubble";
import BubbleContainer from "./bubble/BubbleContainer";

const BubbleEffect: React.FC<BubbleEffectProps> = ({ count = 8, className = "" }) => {
  return <BubbleContainer count={count} className={className} />;
};

export default BubbleEffect;
