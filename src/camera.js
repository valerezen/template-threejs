import * as THREE from "three";

export const setupCamera = (PARAMS, sizes) => {
  if (PARAMS.camera == "perspective") {
    console.log("perspective");
    const camera = new THREE.PerspectiveCamera(
      PARAMS.fov,
      sizes.width / sizes.height,
      0.001,
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
      0.001,
      1000,
    );
    return camera;
  }
};

export const resizeCamera = (camera, aspect, zoom) => {
  if (camera.isPerspectiveCamera) {
    camera.aspect = aspect;
  } else if (camera.isOrthographicCamera) {
    camera.left = -(zoom * aspect) / 2;
    camera.right = (zoom * aspect) / 2;
    camera.top = zoom / 2;
    camera.bottom = -zoom / 2;
  }

  camera.updateProjectionMatrix();
};
