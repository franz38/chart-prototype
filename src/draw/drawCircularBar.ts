import * as d3 from "d3";
import { Plot } from "../state/plots/dto";
import { buildScale } from "../utils/d3";
import { d3ExistOrAppend } from "../utils/d3";
import { LinearAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";

export const drawCircularBar = (
  canvas: any,
  plot: Plot,
  data: Dataset,
  xAxis: LinearAxis | undefined,
  yAxis: LinearAxis | undefined,
  chart: Chart
) => {
  if (!xAxis || !yAxis) return;

  const plt = d3ExistOrAppend(
    canvas.select(`g.${plot.name}`).select("path"),
    () => canvas.append("g").attr("class", plot.name).append("path")
  );

  const _XScale = buildScale(xAxis, chart.rect);
  const _YScale = buildScale(yAxis, chart.rect);

  // const plotProps = plot.plotProps as LinePlotProps;

  plt
    .datum(data.values)
    .attr("fill", "none")
    // .attr("stroke", plotProps.color)
    .attr("stroke-width", 3)
    .attr(
      "d",
      d3
        .line()
        .x((d) => _XScale((d as any)[xAxis.key ?? ""]) as number)
        .y((d) => _YScale((d as any)[yAxis.key ?? ""]) as number)
    );
  return plt;
};
