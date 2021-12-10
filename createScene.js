import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("blue");
  return scene;
}
