import { LinearAxis } from "../state/aces/dto";
import { ScatterPlot } from "../state/plots/dto";
import { buildScale } from "../utils/d3";
import { d3ExistOrAppend } from "../utils/d3";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";
import * as d3 from "d3";

export const drawScatter = (
  canvas: any,
  plot: ScatterPlot,
  data: Dataset,
  xAxis: LinearAxis | undefined,
  yAxis: LinearAxis | undefined,
  chart: Chart
) => {
  if (!xAxis || !yAxis) return;

  const plt = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name)
  );

  const _XScale = buildScale(xAxis, chart.rect) as any;
  const _YScale = buildScale(yAxis, chart.rect) as any;

  let colorScale: any = undefined;
  if (plot.color.key && plot.color.domain) {
    if (typeof plot.color.domain[0] === "number")
      colorScale = d3.scaleLinear(
        plot.color.domain as number[],
        plot.color.range as string[]
      );
    else
      colorScale = d3.scaleOrdinal(
        plot.color.domain as string[],
        plot.color.range as string[]
      );
  }

  let sizeScale: any = undefined;
  if (plot.size.key)
    sizeScale = d3.scaleLinear(
      plot.size.domain as number[],
      plot.size.range as number[]
    );

  const getColor = (d: any) => {
    if (plot.color.key) return colorScale(d[plot.color.key]);
    return plot.color.fixedValue;
  };

  const getSize = (d: any) => {
    if (plot.size.key) return sizeScale(d[plot.size.key]);
    return plot.size.fixedValue;
  };

  plt
    .selectAll("circle")
    .data(data.values)
    .join("circle")
    .attr("cx", (d) => _XScale(d[xAxis.key ?? ""]))
    .attr("cy", (d) => _YScale(d[yAxis.key ?? ""]))
    .attr("r", (d) => getSize(d))
    .attr("fill", (d) => getColor(d));

  return plt;
};
