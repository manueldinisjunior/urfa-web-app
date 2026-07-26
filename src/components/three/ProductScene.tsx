import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ProductSceneProps {
  modelUrl?: string;
}

const ProductScene = ({ modelUrl }: ProductSceneProps) => {
  useEffect(() => {
    // Any setup or loading logic can go here
  }, [modelUrl]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      {/* Add your 3D model components here */}
      <OrbitControls />
    </Canvas>
  );
};

export default ProductScene;
