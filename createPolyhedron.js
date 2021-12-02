import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createPolyhedron() {
  const vertices = [
    -2, -0.5, -1, 2, -0.5, -1, 2, 0.5, -1, -2, 0.5, -1, -2, -0.5, 1, 2, -0.5, 1,
    2, 0.5, 1, -2, 0.5, 1,
  ];
  const faces = [
    1, 2, 6, 6, 5, 1, 0, 4, 7, 7, 3, 0, 4, 5, 6, 6, 7, 4, 2, 1, 0, 0, 3, 2, 2,
    3, 7, 7, 6, 2, 0, 1, 5, 5, 4, 0,
  ];
  const radius = 0.5; // ui: radius
  const detail = 0; // ui: detail
  const geometry = new THREE.PolyhedronGeometry(
    vertices,
    faces,
    radius,
    detail
  );
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 5, 0);
  return mesh;
}
