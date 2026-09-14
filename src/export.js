import { Pane } from "tweakpane";

const exportPane = new Pane({
  title: "Export",
  container: document.querySelector("#export-pane"),
});

const tab = exportPane.addTab({
  pages: [
    {
      title: "Static",
    },
    {
      title: "Motion",
    },
  ],
});

export const setupExport = (capture) => {
  tab.pages[0]
    .addButton({
      title: "Export PNG",
    })
    .on("click", capture);
};

export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
