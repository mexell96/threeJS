import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js";
import createRenderer from "./createRenderer.js";
import createScene from "./createScene.js";
import createCamera from "./createCamera.js";
import createCube from "./createCube.js";
import createLight from "./createLight.js";
import animate from "./animate.js";
import createRequest from "./createRequest.js";
import createControls from "./createControls.js";
import windowResize from "./windowResize.js";

let cube;
let cube3;
const objects = [];

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);
createLight(scene);

const cubes = {
  pink: createCube({ color: 0xff00ce, x: -100, y: 400 }),
  purple: createCube({ color: 0x9300fb, x: 100, y: 400 }),
  blue: createCube({ color: 0x0065d9, x: 100, y: 300 }),
  cyan: createCube({ color: 0x00d7d0, x: -100, y: 300 }),
};

for (const object of Object.values(cubes)) {
  scene.add(object);
}

animate(() => {
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => windowResize(camera, renderer));

main();

function main() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  window.addEventListener("dblclick", onPointerDown, false);
  function onPointerDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, false);
    console.log("intersects", intersects);
    if (intersects.length > 0) {
      const intersect = intersects[0].object;
      if (intersect.name === "cube") {
        //green
        camera.position.x = 1700;
        camera.position.y = 150;
        camera.position.z = 0;
        controls.target.set(1600, 150, 0);
      }
      if (intersect.name === "cube3") {
        //orange
        camera.position.x = -1700;
        camera.position.y = 150;
        camera.position.z = 0;
        controls.target.set(-1600, 150, 0);
        createRequest();
      }
      if (intersect.name === "arrow1") {
        //arrow
        intersect.material = new THREE.MeshBasicMaterial({ color: 0xffce9b });
        camera.position.x = 100;
        camera.position.y = 150;
        camera.position.z = 0;
        controls.target.set(0, 150, 0);
      }
      controls.update();
    }
    render();
  }
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./untitled.gltf", (gltf) => {
      gltf.scene.scale.multiplyScalar(100);
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;
      scene.add(gltf.scene);
      const boxWidth = 2;
      const boxHeight = 1;
      const boxDepth = 2;
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
      const material = new THREE.MeshBasicMaterial({ color: 0x35591a }); //green
      cube = new THREE.Mesh(geometry, material);
      cube.position.x = 16;
      cube.position.y = 0;
      cube.position.z = 0;
      cube.name = "cube";
      gltf.scene.add(cube);
      objects.push(cube);
      const material3 = new THREE.MeshBasicMaterial({ color: 0xffce3b }); //orange
      cube3 = new THREE.Mesh(geometry, material3);
      cube3.position.x = -16;
      cube3.position.y = 0;
      cube3.position.z = 0;
      cube3.name = "cube3";
      gltf.scene.add(cube3);
      objects.push(cube3);
      const vertices = [
        -2, -0.5, -1, 2, -0.5, -1, 2, 0.5, -1, -2, 0.5, -1, -2, -0.5, 1, 2,
        -0.5, 1, 2, 0.5, 1, -2, 0.5, 1,
      ];
      const faces = [
        1,
        2,
        6,
        6,
        5,
        1, //front
        0,
        4,
        7,
        7,
        3,
        0, //back
        4,
        5,
        6,
        6,
        7,
        4, //left
        2,
        1,
        0,
        0,
        3,
        2, //right
        2,
        3,
        7,
        7,
        6,
        2, //top
        0,
        1,
        5,
        5,
        4,
        0, //bottom
      ];
      const radius = 0.5; // ui: radius
      const detail = 0; // ui: detail
      const geometry9 = new THREE.PolyhedronGeometry(
        vertices,
        faces,
        radius,
        detail
      );
      const material9 = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry9, material9);
      mesh.position.x = 0;
      mesh.position.y = 5;
      mesh.position.z = 0;
      gltf.scene.add(mesh);
      controls.target.set(1600, 150, 0);
      // controls.target.set(0, 500, 0);
      controls.update();
    });
  }
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./arrow.gltf", (gltf) => {
      gltf.scene.scale.multiplyScalar(100);
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;
      scene.add(gltf.scene);
      gltf.scene.children[2].name = "arrow1";
      objects.push(gltf.scene.children[2]);
      controls.update();
    });
  }
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
