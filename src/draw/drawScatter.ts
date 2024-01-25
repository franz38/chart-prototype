import { LinearAxis } from "../state/aces/dto";
import { ScatterPlot, ScatterPlotProps } from "../state/plots/dto";
import { buildScale } from "../utils/d3";
import { d3ExistOrAppend } from "../utils/d3";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";

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

  const plotProps = plot.plotProps as ScatterPlotProps;

  plt
    .selectAll("circle")
    .data(data.values)
    .join("circle")
    .attr("cx", (d) => _XScale(d[xAxis.key ?? ""]))
    .attr("cy", (d) => _YScale(d[yAxis.key ?? ""]))
    .attr("r", plotProps.size)
    .attr("fill", plotProps.color);

  return plt;
};
