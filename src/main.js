import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { toRadians, map, lerp, random } from "./utils.js";

import { Pane } from "tweakpane";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { setupExport, saveBlob } from "./export.js";
import { setupCamera, resizeCamera } from "./camera.js";

gsap.registerPlugin(CustomEase);

const myCanvas = document.querySelector(".webgl");
const pane = new Pane({
  title: "Params",
});

const PARAMS = {
  aspectRatio: 3 / 4,
  camera: "perspective",
  fov: 75,
  zoom: 4,
};

const resolutions = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const sizes = {
  width: 0,
  height: 0,
};

sizes.width = Math.min(
  resolutions.width,
  resolutions.height * PARAMS.aspectRatio,
);
sizes.height = sizes.width / PARAMS.aspectRatio;

pane
  .addBinding(PARAMS, "camera", {
    options: {
      perspective: "perspective",
      orthographic: "orthographic",
    },
    label: "camera",
  })
  .on("change", () => {
    console.log("test");
    changeCamera(
      PARAMS,
      fovBinding,
      zoomBinding,
      controls,
      sizes,
      renderer,
      camera,
    );
  });

const fovBinding = pane
  .addBinding(PARAMS, "fov", {
    min: 1,
    max: 179,
    step: 1,
  })
  .on("change", () => {
    const oldFov = THREE.MathUtils.degToRad(camera.fov);
    const newFov = THREE.MathUtils.degToRad(PARAMS.fov);
    const ratio = Math.tan(oldFov / 2) / Math.tan(newFov / 2);

    camera.position
      .sub(controls.target)
      .multiplyScalar(ratio)
      .add(controls.target);

    camera.fov = PARAMS.fov;
    console.log(PARAMS.fov, camera.fov);
    camera.updateProjectionMatrix();
  });

const zoomBinding = pane
  .addBinding(PARAMS, "zoom", {
    min: 1,
    max: 50,
    step: 0.1,
  })
  .on("change", () => {
    resize();
  });

//Scene
const scene = new THREE.Scene();

//Object
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({
    color: "#ffffff",
    wireframe: true,
  }),
);

scene.add(cube);

//Camera

let camera = setupCamera(PARAMS, sizes);
camera.position.z = 5;

//Render
const renderer = new THREE.WebGLRenderer({
  canvas: myCanvas,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

let controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//Animate
const timer = new THREE.Timer();
timer.connect(document);

setupExport(() => {
  renderer.render(scene, camera);

  myCanvas.toBlob((blob) => {
    saveBlob(blob, `screencapture-${myCanvas.width}x${myCanvas.height}.png`);
  }, "image/png");
});

const tick = () => {
  timer.update();
  const delta = timer.getDelta();

  cube.rotation.y += delta * 0.5;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

//Resize
const resize = () => {
  resolutions.width = window.innerWidth;
  resolutions.height = window.innerHeight;
  sizes.width = Math.min(
    resolutions.width,
    resolutions.height * PARAMS.aspectRatio,
  );

  sizes.height = sizes.width / PARAMS.aspectRatio;

  const aspect = sizes.width / sizes.height;

  resizeCamera(camera, aspect, PARAMS.zoom);

  renderer.setSize(sizes.width, sizes.height);
};

const updateBinding = () => {
  const isOrtho = PARAMS.camera === "orthographic";

  fovBinding.hidden = isOrtho;
  zoomBinding.hidden = !isOrtho;
};
updateBinding();

const changeCamera = () => {
  const position = camera.position.clone();
  const target = controls.target.clone();

  controls.dispose();

  camera = setupCamera(PARAMS, sizes);
  camera.position.copy(position);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.update();

  updateBinding();
  resize();
};

pane
  .addBinding(PARAMS, "aspectRatio", {
    options: {
      "1:1": 1 / 1,
      "3:4": 3 / 4,
      "4:3": 4 / 3,
      "3:5": 3 / 5,
      "4:5": 4 / 5,
      "9:16": 9 / 16,
    },
    label: "ratio",
  })
  .on("change", resize);

window.addEventListener("resize", resize);

tick();
