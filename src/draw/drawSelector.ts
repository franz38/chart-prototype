import { Rect } from "../state/dto";
import { LinearAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { isVertical } from "../utils/axis";

export const drawSelection2 = (svgElement: any, rect: Rect) => {
  return svgElement
    .attr("opacity", 1)
    .attr("x", rect.x)
    .attr("y", rect.y)
    .attr("width", rect.w)
    .attr("height", rect.h);
};

export const drawChartSelection = (selectionRect: any, chart: Chart) => {
  // const path = selectionRect.append("path");
  const x = -chart.padding[3];
  const y = -chart.padding[0];
  const w = chart.rect.w + chart.padding[1] + chart.padding[3];
  const h = chart.rect.h + chart.padding[2] + chart.padding[0];

  return selectionRect
    .attr("opacity", 1)
    .attr("x", x)
    .attr("y", y)
    .attr("width", w)
    .attr("height", h);
};

export const drawAxisSelection = (
  selectionRect: any,
  chart: Chart,
  axis: LinearAxis
) => {
  let x = -chart.padding[3];
  let y = chart.rect.y - chart.padding[0];
  let w = chart.rect.w + chart.padding[1] + chart.padding[3];
  let h = chart.rect.h + chart.padding[2] + chart.padding[0];
  if (isVertical(axis)) {
    y = chart.padding[0];
    w = 30;
  }
  return selectionRect
    .attr("opacity", 1)
    .attr("x", x)
    .attr("y", y)
    .attr("width", w)
    .attr("height", h);
};
