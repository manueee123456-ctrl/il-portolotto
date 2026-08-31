import React from 'react';

export const Scene3D: React.FC = () => {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1920&q=80"
        alt="Barca nel porto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </div>
  );
};

export default Scene3D;
