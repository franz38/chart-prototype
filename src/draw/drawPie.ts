import { CircularAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";
import { PiePlot } from "../state/plots/dto";
import { d3ExistOrAppend } from "../utils/d3";
import * as d3 from "d3";

export const drawPie = (
  canvas: any,
  plot: PiePlot,
  data: Dataset,
  _chart: Chart,
  circularAxis: CircularAxis,
) => {
  if (!circularAxis) return;

  const plt = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name),
  );

  let colorScale: any = undefined;
  if (plot.color.key && plot.color.domain) {
    if (typeof plot.color.domain[0] === "number")
      colorScale = d3.scaleLinear(
        plot.color.domain as number[],
        plot.color.range as string[],
      );
    else
      colorScale = d3.scaleOrdinal(
        plot.color.domain as string[],
        plot.color.range as string[],
      );
  }

  let borderColorScale: any = undefined;
  if (plot.borderColor.key && plot.borderColor.domain) {
    if (typeof plot.borderColor.domain[0] === "number")
      borderColorScale = d3.scaleLinear(
        plot.borderColor.domain as number[],
        plot.borderColor.range as string[],
      );
    else
      borderColorScale = d3.scaleOrdinal(
        plot.borderColor.domain as string[],
        plot.borderColor.range as string[],
      );
  }

  const getColor = (d: any) => {
    if (plot.color.key) return colorScale(d.data[plot.color.key]);
    return plot.color.fixedValue;
  };

  const getBorderColor = (d: any) => {
    if (plot.borderColor.key)
      return borderColorScale(d.data[plot.borderColor.key]);
    return plot.borderColor.fixedValue;
  };

  const pie = d3
    .pie()
    .startAngle((plot.startAngle / 180) * Math.PI)
    .endAngle((plot.endAngle / 180) * Math.PI)
    .padAngle(plot.anglePadding / 100)
    .value(function (d: any) {
      return d[circularAxis.key];
    });
  const data_ready = pie(data.values);

  plt.attr("transform", `translate(${plot.radius} ${plot.radius})`);

  plt
    .selectAll("path")
    .data(data_ready)
    .join("path")
    .attr(
      "d",
      d3.arc().innerRadius(plot.innerradius).outerRadius(plot.radius) as any,
    )
    // .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("fill", (d) => getColor(d))
    .attr("stroke", (d) => getBorderColor(d))
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  return plt;
};

export const getPieCode = (
  plot: PiePlot,
  circularAxis: CircularAxis,
  _chart: Chart,
): string => {
  let borderScaleString = undefined;
  let colorScaleString = undefined;
  if (plot.color.key && plot.color.domain && plot.color.range) {
    if (typeof plot.color.domain[0] === "number")
      colorScaleString = `const colorScale = d3.scaleLinear(
        [${plot.color.domain as number[]}],
        [${plot.color.range.map((v) => `"${v}"`)}]
      );`;
    else
      colorScaleString = `const colorScale = d3.scaleOrdinal(
        [${plot.color.domain.map((v) => `"${v}"`)}]
        [${plot.color.range.map((v) => `"${v}"`)}]
      );`;
  }
  if (
    plot.borderColor.key &&
    plot.borderColor.domain &&
    plot.borderColor.range
  ) {
    if (typeof plot.borderColor.domain[0] === "number")
      borderScaleString = `const colorScale = d3.scaleLinear(
        [${plot.borderColor.domain as number[]}],
        [${plot.borderColor.range.map((v) => `"${v}"`)}]
      );`;
    else
      borderScaleString = `const colorScale = d3.scaleOrdinal(
        [${plot.borderColor.domain.map((v) => `"${v}"`)}]
        [${plot.borderColor.range.map((v) => `"${v}"`)}]
      );`;
  }

  return `
const pie = d3
  .pie()
  .startAngle((${plot.startAngle} / 180) * Math.PI)
  .endAngle((${plot.endAngle} / 180) * Math.PI)
  .padAngle(${plot.anglePadding} / 100)
  .value(function (d) {
    return d["${circularAxis.key}"];
  });
const data_ready = pie(data.values);

plt.attr("transform", "translate(${plot.radius} ${plot.radius})");

plt
  .selectAll("path")
  .data(data_ready)
  .join("path")
  .attr(
    "d",
    d3.arc().innerRadius(${plot.innerradius}).outerRadius(${plot.radius})
  )
  .attr("fill", ${
    colorScaleString ? "(d) => colorScale(d)" : `"${plot.color.fixedValue}"`
  })
  .attr("stroke", ${
    borderScaleString
      ? "(d) => colorScale(d)"
      : `"${plot.borderColor.fixedValue}"`
  })
  .style("stroke-width", "2px")
  .style("opacity", 0.7);
`;
};
