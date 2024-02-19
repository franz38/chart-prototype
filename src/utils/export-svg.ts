import { saveAs } from "file-saver";
import * as d3 from "d3";

const getSvg = (svgRef: any, hiddenSvgRef: any) => {
  const rect = (
    d3.select(svgRef).select("g").node() as any
  ).getBoundingClientRect();

  const _svg = d3.select(svgRef).select("g").clone(true);
  const _svgcopy = d3.select(hiddenSvgRef).append("svg") as any;

  _svg.selectAll("g.selectorBox").remove();
  _svg.selectAll("rect.selector").remove();

  _svgcopy.append(() => _svg.node()) as any;

  const currentTranslation = _svg.attr("transform");

  const regex = /translate\((\d+),\s*(\d+)\)/;
  const match = currentTranslation.match(regex);

  if (match) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);

    _svgcopy
      .select("g")
      .attr("transform", `translate(${x - rect.x} ${y - rect.y})`);
  }

  _svgcopy.attr("width", `${rect.width}`);
  _svgcopy.attr("height", `${rect.height}`);

  return _svgcopy;
};

export const exportSvg = (svgRef: any, hiddenSvgRef: any, fileName: string) => {
  const _svgcopy = getSvg(svgRef, hiddenSvgRef);

  const _html = _svgcopy
    .attr("title", "test2")
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .node();
  const html = _html.parentNode.innerHTML;

  if (html) {
    const blob = new Blob([html], { type: "image/svg" });
    saveAs(blob, `${fileName}.svg`);
  }

  d3.select(hiddenSvgRef).select("svg").remove();
};

export const exportPng = async (
  svgRef: any,
  hiddenSvgRef: any,
  fileName: string
) => {
  const rect = (
    d3.select(svgRef).select("g").node() as any
  ).getBoundingClientRect();

  const _svgcopy = getSvg(svgRef, hiddenSvgRef);

  const serialized = new XMLSerializer().serializeToString(_svgcopy.node());

  const b64Chart = "data:image/svg+xml;base64," + btoa(serialized);

  const fileString = await getPng(b64Chart, rect.width, rect.height);

  if (fileString) {
    const blob = new Blob([fileString], { type: "image/png" });
    saveAs(blob, `${fileName}.png`);
  }

  d3.select(hiddenSvgRef).select("svg").remove();
};

const getPng = (b64: string, width: number, height: number) => {
  return new Promise<string | null>((resolve) => {
    let img = document.createElement("img");
    img.src = b64;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      // canvas.style.width = Math.floor(width * window.devicePixelRatio)  + "px";
      // canvas.style.height = Math.floor(height * window.devicePixelRatio)  + "px";
      let ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        canvas.toBlob(resolve as any);
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
  });
};
