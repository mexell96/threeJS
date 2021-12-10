import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js";
import createCube from "./createCube.js";

let cubeGreen;
let cubeLightGreen;
let cubeYellow;
let cubeRed;
let cubeBlue;
let cubeDarkMagenta;

const objects = [];

export default function gltfLoader(scene, controls) {
  const gltfLoader1 = new GLTFLoader();
  gltfLoader1.load("./untitled.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);

    cubeGreen = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x35591a,
      x: 16,
      y: 0,
      z: 0,
      name: "cubeGreen",
    });
    cubeYellow = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0xffce3b,
      x: -14,
      y: 0,
      z: 0,
      name: "cubeYellow",
    });
    cubeRed = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0xff1100,
      x: -14,
      y: 0,
      z: -10,
      name: "cubeRed",
    });
    cubeBlue = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x1b2ba5,
      x: -14,
      y: 0,
      z: 10,
      name: "cubeBlue",
    });
    cubeLightGreen = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x93c47d,
      x: -55,
      y: 0,
      z: 2,
      name: "cubeDarkGreen",
    });
    cubeDarkMagenta = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x741b47,
      x: -14,
      y: 0,
      z: 20,
      name: "cubeDarkMagenta",
    });

    gltf.scene.add(
      cubeGreen,
      cubeYellow,
      cubeRed,
      cubeBlue,
      cubeLightGreen,
      cubeDarkMagenta
    );
    objects.push(
      cubeGreen,
      cubeYellow,
      cubeRed,
      cubeBlue,
      cubeLightGreen,
      cubeDarkMagenta
    );
    controls.update();
  });

  const gltfLoader2 = new GLTFLoader();
  gltfLoader2.load("./arrow.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;
    gltf.scene.name = "ARR";
    scene.add(gltf.scene);
    gltf.scene.children[0].name = "arrow1";
    objects.push(gltf.scene.children[0]);
    controls.update();
  });

  const gltfLoader3 = new GLTFLoader();
  gltfLoader3.load("./cylinder.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);
    gltf.scene.position.x = -2800;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = -300;
    gltf.scene.name = "Cyl";
    scene.add(gltf.scene);
    gltf.scene.children[0].name = "cylinder";
    objects.push(gltf.scene.children[0]);
    controls.update();
  });

  return objects;
}
