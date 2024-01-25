import * as d3 from "d3";
import {
  Axis,
  AxisPosition,
  AxisType,
  LinearAxis,
} from "../state/aces/dto";
import { Rect } from "../state/dto";
import { buildScale } from "../utils/d3";
import { isVertical } from "../utils/axis";
import { Chart } from "../state/chart/dto";

export const _drawAxis = (
  _axis: Axis,
  chart: Chart,
  svgRef: React.MutableRefObject<null>,
  plotId: string
) => {
  if (_axis.type === AxisType.Linear) {
    const axis = _axis as LinearAxis;
    const _svg = d3
      .select(svgRef.current)
      .select(`g.${plotId}`)
      .select("g.acesBox")
      .select("g.shapes");
    _svg.select(`g.${axis.position}`).remove();
    const ax = _svg.append("g").attr("class", axis.position);
    let ax2: any;

    switch (axis.position) {
      case AxisPosition.BOTTOM:
        ax2 = renderBottomAxis(ax, chart.rect, axis);
        break;
      case AxisPosition.TOP:
        ax2 = renderBottomAxis(ax, chart.rect, axis);
        break;
      case AxisPosition.RIGTH:
        ax2 = renderBottomAxis(ax, chart.rect, axis);
        break;
      case AxisPosition.LEFT:
        ax2 = renderLeftAxis(ax, chart.rect, axis);
        break;
    }

    return ax2;
  }
};

export const renderBottomAxis = (
  gContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
  chartRect: Rect,
  axis: LinearAxis
) => {
  const axisInstance = gContainer
    .call(d3.axisBottom(buildScale(axis, chartRect) as any))
    .attr("transform", `translate(0 ${chartRect.h + axis.margin})`);
  renderAxis(gContainer, chartRect, axis, axisInstance);
  return axisInstance;
};
export const renderLeftAxis = (
  gContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
  chartRect: Rect,
  axis: LinearAxis
) => {
  const axisInstance = gContainer
    .call(d3.axisLeft(buildScale(axis, chartRect) as any))
    .attr("transform", `translate(${-axis.margin} 0)`);
  renderAxis(gContainer, chartRect, axis, axisInstance);
  return axisInstance;
};
export const renderAxis = (
  _gContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
  chartRect: Rect,
  axis: LinearAxis,
  axisInstance: any
) => {
  const style = axis.style;

  axisInstance
    .select(".domain")
    .attr("stroke", style.lineColor)
    .attr("stroke-width", style.lineThickness)
    .attr("display", style.lineVisible ? "initial" : "none");

  const labelBox = axisInstance.append("g").attr("class", "label");

  labelBox
    .append("text")
    .text(axis.label ?? axis.key)
    .attr("fill", axis.labelStyle.color);

  if (isVertical(axis))
    labelBox.attr("transform", `translate(-50 ${chartRect.h / 2})`);
  else labelBox.attr("transform", `translate(${chartRect.w / 2} 50)`);

  const ticks = axisInstance.selectAll(".tick");
  ticks
    .select("line")
    .attr("stroke", style.tickColor)
    .attr("stroke-width", style.tickThickness)
    .attr("display", style.tickVisible ? "initial" : "none");
  if (axis.showGrid && isVertical(axis))
    ticks.select("line").attr("x1", chartRect.w + axis.margin);
  else if (axis.showGrid)
    ticks.select("line").attr("y1", -chartRect.h - axis.margin);

  ticks
    .select("text")
    .attr("fill", style.fontColor)
    .attr("font-size", style.fontSize)
    .attr("display", style.tickTextVisible ? "initial" : "none");
};
