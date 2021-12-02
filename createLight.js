import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";

export default function createLight(scene) {
  const skyColor = 0xb1e1ff;
  const groundColor = 0xb97a20;
  const intensity = 1;
  const light1 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light1);

  const color = 0xffffff;
  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(5, 10, 2);
  scene.add(light2);
  scene.add(light2.target);

  const light3 = new THREE.PointLight(0xffffff, 1, 1000);
  light3.position.set(0, 0, 10);
  scene.add(light3);
}
