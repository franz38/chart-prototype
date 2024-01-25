import { RadarAxis } from "../state/aces/dto";
import { SpiderPlot } from "../state/plots/dto";
import { d3ExistOrAppend } from "../utils/d3";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";

export const drawSpider = (
  canvas: any,
  plot: SpiderPlot,
  _data: Dataset,
  aces: RadarAxis[],
  _chart: Chart
) => {

  if (!aces || aces.length == 0) return;

  const plt = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name)
  );

  // const _XScale = buildScale(xAxis, chart.rect) as any;
  // const _YScale = buildScale(yAxis, chart.rect) as any;
  // const scales

  // const plotProps = plot.plotProps as SpiderPlotProps;

  plt.append("circle")
    .attr("r", 100)
    .attr("cx", 0)
    .attr("cy", 0)

  // plt
  //   .selectAll("circle")
  //   .data(data.values)
  //   .join("circle")
  //   .attr("cx", (d) => _XScale(d[xAxis.key ?? ""]))
  //   .attr("cy", (d) => _YScale(d[yAxis.key ?? ""]))
  //   .attr("r", plotProps.size)
  //   .attr("fill", plotProps.color);

  return plt;
};
