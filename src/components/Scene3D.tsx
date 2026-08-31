import React from 'react';

export const Scene3D: React.FC = () => {
  // Recupera il percorso base per funzionare anche su GitHub Pages
  const baseUrl = import.meta.env.BASE_URL || '/';

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
        src={`${baseUrl}barca.webp`}
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
