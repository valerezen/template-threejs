import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { toRadians, map, lerp, random } from "./utils.js";
import { Pane } from "tweakpane";

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
  width: resolutions.height * PARAMS.aspectRatio,
  height: resolutions.height,
};

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
    changeCamera();
  });

const fovBinding = pane.addBinding(PARAMS, "fov", {
  min: 0,
  max: 200,
  step: 1,
});

const zoomBinding = pane.addBinding(PARAMS, "zoom", {
  min: 0,
  max: 200,
  step: 1,
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
const setupCamera = () => {
  if (PARAMS.camera == "perspective") {
    console.log("perspective");
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );

    return camera;
  } else {
    console.log("orthographic");
    const viewHeight = PARAMS.zoom;
    const aspect = sizes.width / sizes.height;
    const viewWidth = viewHeight * aspect;

    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      viewHeight / 2,
      -viewHeight / 2,
      1,
      1000,
    );
    return camera;
  }
};

let camera = setupCamera();
camera.position.z = 3;

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
const tick = () => {
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

//Resize
const resize = () => {
  resolutions.width = window.innerWidth;
  resolutions.height = window.innerHeight;
  sizes.width = resolutions.height * PARAMS.aspectRatio;
  sizes.height = resolutions.height;

  const aspect = sizes.width / sizes.height;

  if (camera.isPerspectiveCamera) {
    camera.aspect = aspect;
  } else if (camera.isOrthographicCamera) {
    camera.left = -(PARAMS.zoom * aspect) / 2;
    camera.right = (PARAMS.zoom * aspect) / 2;
    camera.top = PARAMS.zoom / 2;
    camera.bottom = -PARAMS.zoom / 2;
  }

  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
};

const changeCamera = () => {
  const position = camera.position.clone();
  const target = controls.target.clone();
  controls.dispose();
  camera.removeFromParent();

  camera = setupCamera();
  camera.position.copy(position);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.update();
  updateCameraBinding();
  resize();
};

const updateCameraBinding = () => {
  if (PARAMS.camera == "orthographic") {
    fovBinding.hidden = true;
    zoomBinding.hidden = false;
  } else if (PARAMS.camera == "perspective") {
    fovBinding.hidden = false;
    zoomBinding.hidden = true;
  }
};
updateCameraBinding();

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
