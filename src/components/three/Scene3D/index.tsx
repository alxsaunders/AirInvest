// src/components/three/Scene3D/index.tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Model } from './Model';
import styles from './Scene3D.module.css';

export default function Scene3D() {
  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
          />
          

<Model 
  url="/airinvst2.glb"
  position={[1, 0, 0]}
  scale={[0.001, 0.001, 0.001]}
/>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}