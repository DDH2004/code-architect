import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Building } from './Building.jsx';
import { LinkLine } from './LinkLine.jsx';

function layout(nodes) {
  const out = [];
  const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length || 1)));
  const size = 6;
  nodes.forEach((n, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = (col - cols / 2) * size;
    const z = (row - cols / 2) * size;
    const h = Math.max(1, Math.log2((n.loc || 0) + 1) * 4);
    const complexity = n.complexity || 0;
    const color = complexity > 20 ? '#ff6b6b' : complexity > 8 ? '#facc15' : '#60a5fa';
    out.push({ ...n, x, z, w: 4, d: 4, h, color, y: h / 2 });
  });
  return out;
}

export function ThreeScene({ nodes = [], links = [], onFocus = () => {} }) {
  const grid = useMemo(() => layout(nodes), [nodes]);
  return (
    <Canvas camera={{ position: [0, 50, 120], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <OrbitControls />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={'#061022'} />
      </mesh>
      {grid.map(n => (
        <Building key={n.path} x={n.x} z={n.z} width={n.w} depth={n.d} height={n.h} color={n.color} data={n} onClick={onFocus} />
      ))}
      {links.map((l, i) => {
        const a = grid.find(g => g.path === l.source);
        const b = grid.find(g => g.path === l.target);
        if (!a || !b) return null;
        return <LinkLine key={i} a={a} b={b} />;
      })}
    </Canvas>
  );
}