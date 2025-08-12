import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Building({ x, z, width, depth, height, color, data, onClick }) {
  const ref = useRef(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002;
  });
  return (
    <mesh
      ref={ref}
      position={[x, height / 2, z]}
      onClick={() => onClick && onClick(data)}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}