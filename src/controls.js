import { Pane } from "tweakpane";

export const initPane = () => {
  const pane = new Pane({
    title: "Params",
  });
  return pane;
};

export const initCameraChangeBinding = (params, pane, onCameraChange) => {
  return pane
    .addBinding(params, "camera", {
      options: {
        perspective: "perspective",
        orthographic: "orthographic",
      },
      label: "camera",
    })
    .on("change", onCameraChange);
};

export const initFovBinding = (params, pane, onFovChange) => {
  return pane
    .addBinding(params, "fov", {
      min: 1,
      max: 179,
      step: 1,
    })
    .on("change", onFovChange);
};

export const initZoomBinding = (params, pane, onZoomChange) => {
  return pane
    .addBinding(params, "zoom", {
      min: 1,
      max: 50,
      step: 0.1,
    })
    .on("change", onZoomChange);
};
