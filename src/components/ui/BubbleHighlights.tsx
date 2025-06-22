
const BubbleHighlights = () => {
  return (
    <>
      {/* Primary highlight */}
      <div 
        style={{
          position: 'absolute',
          width: '40%',
          height: '15%',
          background: 'rgba(255, 255, 255, 0.9)',
          top: '20%',
          left: '25%',
          borderRadius: '50%',
          transform: 'rotate(-20deg)',
          filter: 'blur(1px)',
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
    </>
  );
};

export default BubbleHighlights;
