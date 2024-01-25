import { CircularAxis } from "../state/aces/dto";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";
import { PiePlot, PiePlotProps } from "../state/plots/dto";
import { d3ExistOrAppend } from "../utils/d3";
import * as d3 from "d3";

export const drawPie = (
  canvas: any,
  plot: PiePlot,
  data: Dataset,
  _chart: Chart,
  circularAxis: CircularAxis
) => {
  const plt = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas.append("g").attr("class", plot.name)
  );

  const plotProps = plot.plotProps as PiePlotProps;

  const pie = d3
    .pie()
    .startAngle((plotProps.startAngle / 180) * Math.PI)
    .endAngle((plotProps.endAngle / 180) * Math.PI)
    .padAngle(plotProps.anglePadding / 100)
    .value(function (d: any) {
      return d[circularAxis.key];
    });
  const data_ready = pie(data.values);

  plt.attr("transform", `translate(${plotProps.radius} ${plotProps.radius})`);

  plt
    .selectAll("path")
    .data(data_ready)
    .join("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(plotProps.innerradius)
        .outerRadius(plotProps.radius) as any
    )
    // .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("fill", plotProps.color)
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  return plt;
};
