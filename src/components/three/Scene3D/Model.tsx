// src/components/three/Scene3D/Model.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function Model({ 
  url, 
  position, 
  rotation = [0, 0, 0], 
  scale = [0.001, .001, .001] 
}: ModelProps) {
  const modelRef = useRef<THREE.Group>();
  const gltf = useLoader(GLTFLoader, url);
  
  // Bounce animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}