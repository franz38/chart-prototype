import { ScaleBand, ScaleLinear } from "d3";
import { LinearAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";
import { BarPlot } from "../state/plots/dto";
import { buildScale, d3ExistOrAppend } from "../utils/d3";
import * as d3 from "d3"

export const drawBar = (
  canvas: any,
  plot: BarPlot,
  data: Dataset,
  xAxis: LinearAxis | undefined,
  yAxis: LinearAxis | undefined,
  chart: Chart
) => {
  if (!xAxis || !yAxis) return;
  if (xAxis.scale.type !== "band" || yAxis.scale.type !== "linear") return;

  const plotBox = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name)
  ) as any;

  const _XScale = buildScale(xAxis, chart.rect) as ScaleBand<string>;
  const _YScale = buildScale(yAxis, chart.rect) as ScaleLinear<number, number, never>;

  let colorScale: any = undefined;
  if (plot.fill.key && plot.fill.domain) {
    if (typeof plot.fill.domain[0] === "number")
      colorScale = d3.scaleLinear(
        plot.fill.domain as number[],
        plot.fill.range as string[]
      );
    else
      colorScale = d3.scaleOrdinal(
        plot.fill.domain as string[],
        plot.fill.range as string[]
      );
  }

  const getColor = (d: any) => {
    if (plot.fill.key) return colorScale(d[plot.fill.key]);
    return plot.fill.fixedValue;
  };

  const width = _XScale.bandwidth() - plot.padding
  

  plotBox
    .selectAll("rect")
    .data(data.values)
    .join("rect")
    .attr("x", (d: any) => _XScale(d[xAxis.key ?? ""]) as number + plot.padding/2)
    .attr("y", (d: any) => {
      if (yAxis.invert){
        return (_YScale(d[yAxis.key ?? ""]) ?? 0)
      }
      else {
        return 0
      }
    })
    .attr("width", () => width)
    .attr("height", (d: any) => yAxis.invert ? _YScale.range()[0] - _YScale(d[yAxis.key ?? ""]) : _YScale(d[yAxis.key ?? ""]))
    .attr("fill", (d: any) => getColor(d))
    .attr("stroke", () => plot.color)
    .attr("stroke-width", () => plot.size)
    .attr("data-name", (d: any) => d["Title"])
  
};
