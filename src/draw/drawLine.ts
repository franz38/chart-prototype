import * as d3 from "d3";
import { LinePlot } from "../state/plots/dto";
import { buildScale } from "../utils/d3";
import { d3ExistOrAppend } from "../utils/d3";
import { LinearAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";

export const drawLine = (
  canvas: any,
  plot: LinePlot,
  data: Dataset,
  xAxis: LinearAxis | undefined,
  yAxis: LinearAxis | undefined,
  chart: Chart,
) => {
  if (!xAxis || !yAxis) return;

  const plotBox = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name),
  ) as any;

  const plt2 = d3ExistOrAppend(plotBox.select("path.p2"), () =>
    plotBox.append("path").attr("class", "p2"),
  );

  const plt = d3ExistOrAppend(plotBox.select("path.p1"), () =>
    plotBox.append("path").attr("class", "p1"),
  );

  const _XScale = buildScale(xAxis, chart.rect);
  const _YScale = buildScale(yAxis, chart.rect);

  plt
    .datum(data.values)
    .attr("fill", "none")
    .attr("stroke", plot.color)
    .attr("stroke-width", plot.size)
    .attr(
      "d",
      d3
        .line()
        .x((d) => _XScale((d as any)[xAxis.key ?? ""]) as number)
        .y((d) => _YScale((d as any)[yAxis.key ?? ""]) as number),
    );

  plt2
    .datum(data.values)
    .attr("fill", plot.fill)
    .attr(
      "d",
      d3
        .area()
        .x((d) => _XScale((d as any)[xAxis.key ?? ""]) as number)
        .y1((d) => _YScale((d as any)[yAxis.key ?? ""]) as number)
        .y0(yAxis.invert ? _YScale.range()[0] : _YScale.range()[1]),
    );

  return plotBox;
};

export const getLineCode = (
  plot: LinePlot,
  xAxis: LinearAxis | undefined,
  yAxis: LinearAxis | undefined,
  _chart: Chart,
): string => {
  if (!xAxis || !yAxis) return "";

  return `
plt
  .datum(data.values)
  .attr("fill", "none")
  .attr("stroke", "${plot.color}")
  .attr("stroke-width", ${plot.size})
  .attr(
    "d",
    d3
      .line()
      .x((d) => yScale(d["${xAxis.key}"]))
      .y((d) => yScale(d["${yAxis.key}"]))
  );
`;
};
