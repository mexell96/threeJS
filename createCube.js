import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createCube({ color, x, y }) {
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 100);

  return cube;
}
