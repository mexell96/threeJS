import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createRenderer() {
  const container = document.getElementById("container");
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  return renderer;
}
