'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'

function RotatingBox() {
  const meshRef = useRef<Mesh>(null!)
  const [isDragging, setIsDragging] = useState(false)
  const [initialPointerPosition, setInitialPointerPosition] = useState<Vector3 | null>(null)

  useFrame((state, delta) => {
    if (!isDragging) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta
    }
  })

  const handlePointerDown = (event: any) => {
    setIsDragging(true)
    setInitialPointerPosition(event.point)
  }

  const handlePointerMove = (event: any) => {
    if (isDragging && initialPointerPosition) {
      const deltaX = event.point.x - initialPointerPosition.x
      const deltaY = event.point.y - initialPointerPosition.y

      // Move the box along the x and y axis based on pointer movement
      meshRef.current.position.x += deltaX
      meshRef.current.position.y += deltaY

      // Update the initial position for the next move
      setInitialPointerPosition(event.point)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  return (
    <Box
      ref={meshRef}
      args={[2, 2, 2]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp} // Stop dragging when the pointer leaves the object
    >
      <meshStandardMaterial color="orange" />
    </Box>
  )
}

export default function ThreeScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
    </Canvas>
  )
}
