
import React from "react";

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection = ({ title, children }: FooterSectionProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
      {children}
    </div>
  );
};

export default FooterSection;
