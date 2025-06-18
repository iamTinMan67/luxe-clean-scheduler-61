
import React from 'react';

const BubblesEffect = () => {
  // Define the keyframes as a CSS string that we'll inject
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes bubble-float {
        0%, 100% {
          transform: translateY(0) scale(1);
          opacity: 0.2;
        }
        50% {
          transform: translateY(-20px) scale(1.1);
          opacity: 0.4;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div
              className="rounded-full bg-gradient-to-br from-gold/30 to-orange-400/30 blur-sm"
              style={{
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                animation: `bubble-float ${4 + Math.random() * 6}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubblesEffect;
