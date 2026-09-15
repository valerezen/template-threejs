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

export const initAspectRatioBinding = (params, pane, onAspectRatioChange) => {
  return pane
    .addBinding(params, "aspectRatio", {
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
    .on("change", onAspectRatioChange);
};

export const initColorsBinding = (params, pane, onColorsChange) => {
  const palette = pane.addFolder({
    title: "Palette",
  });

  params.colors.forEach((color, i) => {
    palette
      .addBinding(params.colors, i, {
        label: `Color ${i + 1}`,
      })
      .on("change", (e) => {
        onColorsChange(i, e.value);
      });
  });
};
