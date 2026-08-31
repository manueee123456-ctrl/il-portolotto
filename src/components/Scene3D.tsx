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
        src="https://res.cloudinary.com/clickandboat-production/image/fetch/q_auto:eco/f_auto/c_auto,g_auto,w_auto:100:700/http://prod-clickandboat-public-bucket.s3.eu-central-1.amazonaws.com/activities/product_168335/images/7fca250f8b5d1a353ea58185f988983eecd60d4637a5f5ecd3830f23d5ef3a54.jpg"
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
