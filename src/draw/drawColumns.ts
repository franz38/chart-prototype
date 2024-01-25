import { BarPlotProps, Plot } from "../state/plots/dto";
import { buildScale } from "../utils/d3";
import { d3ExistOrAppend } from "../utils/d3";
import { Dataset } from "../state/dto";
import { LinearAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";

export const drawColumns = (
  canvas: any,
  plot: Plot,
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

  const plotProps = plot.plotProps as BarPlotProps;

  let bandwidthDelta = 0;
  if (_XScale?.bandwidth) bandwidthDelta = _XScale.bandwidth() / 2;

  plt
    .selectAll("rect")
    .data(data.values)
    .join("rect")
    .attr("height", (d) => _YScale(d[yAxis.key ?? ""]))
    .attr("width", (_d) => plotProps.size)
    .attr(
      "x",
      (d) => _XScale(d[xAxis.key ?? ""]) + bandwidthDelta - plotProps.size / 2
    )
    .attr("y", (d) => _YScale.range()[1] - _YScale(d[yAxis.key ?? ""]))
    .attr("fill", plotProps.color);

  return plt;
};
