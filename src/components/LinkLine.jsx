import React from 'react';
import * as THREE from 'three';

export function LinkLine({ a, b }) {
  const points = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color={"#89b4fa"} linewidth={1} />
    </line>
  );
}