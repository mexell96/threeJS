import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    30000
  );
  camera.position.x = 1700;
  camera.position.y = 150;
  camera.position.z = 0;
  return camera;
}
