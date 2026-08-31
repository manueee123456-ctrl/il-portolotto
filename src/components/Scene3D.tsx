import React from 'react';
import barcaImg from './assets/7fca250f8b5d1a353ea58185f988983eecd60d4637a5f5ecd3830f23d5ef3a54_Nero_AI_Image_Upscaler_Photo_Face.webp';

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
        src={barcaImg}
        alt="Barca a vela al tramonto"
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
