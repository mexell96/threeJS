import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createLight() {
  const light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(0, 0, 10);
  return light;
}
