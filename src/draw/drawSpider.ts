import { SpiderPlot } from "../state/plots/dto";
import { d3ExistOrAppend } from "../utils/d3";
import { Chart } from "../state/chart/dto";
import { Dataset } from "../state/dto";
import * as d3 from "d3";
import { transparentize } from "color2k";

export const drawSpider = (
  canvas: any,
  plot: SpiderPlot,
  _data: Dataset,
  _chart: Chart,
) => {
  const padding = (1 + plot.axisLabelDistance / 100) * plot.axisLenght;

  const plt = d3ExistOrAppend(canvas.select(`g.${plot.name}`), () =>
    canvas
      .append("g")
      .attr("class", plot.name)
      .attr("transform", `translate(${padding}, ${padding})`),
  );

  const scales = Object.keys(plot.aces).reduce(
    (acc, key) => {
      const _scale = plot.aces[key];
      acc[key] = d3.scaleLinear().domain(_scale.domain).range(_scale.range);
      return acc;
    },
    {} as { [id: string]: d3.ScaleLinear<number, number> },
  );

  // radial lines
  plt
    .selectAll("line.axisLine")
    .data(
      Object.keys(plot.aces).map(
        (_, id) => (2 * Math.PI * id) / Object.keys(plot.aces).length,
      ),
    )
    .join("line")
    .attr("class", "axisLine")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d) => plot.axisLenght * Math.cos(d))
    .attr("y2", (d) => plot.axisLenght * Math.sin(d))
    .attr("stroke", plot.acesLinesColor)
    .attr("stroke-width", plot.acesLinesThickness);

  plt
    .selectAll("text.axisLabel")
    .data(
      Object.keys(plot.aces).map((label, id) => ({
        angle: (2 * Math.PI * id) / Object.keys(plot.aces).length,
        label: label,
      })),
    )
    .join("text")
    .attr("class", "axisLabel")
    .text((d) => d.label)
    .attr(
      "x",
      (d) =>
        plot.axisLenght *
        (1 + plot.axisLabelDistance / 100) *
        Math.cos(d.angle),
    )
    .attr(
      "y",
      (d) =>
        plot.axisLenght *
        (1 + plot.axisLabelDistance / 100) *
        Math.sin(d.angle),
    )
    .attr("text-anchor", "middle")
    .attr("font-size", plot.axisLabelSize)
    .attr("fill", plot.axisLabelColor);

  // circular lines
  if (plot.innerLinesStyle === "curve") {
    plt.selectAll("path.radarInnerLine").remove();
    plt
      .selectAll("circle.radarInnerLine")
      .data(
        Array.from(Array(plot.innerLines)).map(
          (_, id) => (plot.axisLenght * (id + 1)) / plot.innerLines,
        ),
      )
      .join("circle")
      .attr("class", "radarInnerLine")
      .attr("r", (d) => d)
      .attr("fill", plot.innerLinesColor)
      .attr("stroke", plot.innerLinesStrokeColor)
      .attr("stroke-width", plot.innerLinesThickness);
  } else {
    plt.selectAll("circle.radarInnerLine").remove();
    plt
      .selectAll("path.radarInnerLine")
      .data(
        Array.from(Array(plot.innerLines)).map(
          (_, id) => (plot.axisLenght * (id + 1)) / plot.innerLines,
        ),
      )
      .join("path")
      .attr("class", "radarInnerLine")
      .attr("d", (d) => {
        const p = d3.path();

        Object.keys(plot.aces).map((_key, id) => {
          const v = d;
          const x =
            v * Math.cos((2 * Math.PI * id) / Object.keys(plot.aces).length);
          const y =
            v * Math.sin((2 * Math.PI * id) / Object.keys(plot.aces).length);
          if (id === 0) p.moveTo(x, y);
          else p.lineTo(x, y);
        });
        p.closePath();
        return p.toString();
      })
      .attr("fill", plot.innerLinesColor)
      .attr("stroke", plot.innerLinesStrokeColor)
      .attr("stroke-width", plot.innerLinesThickness);
  }

  const colors = plot.colors;

  // data
  plt
    .selectAll("path.dataPath")
    .data(_data.values)
    .join("path")
    .attr("class", "dataPath")
    .attr("d", (d) => {
      const p = d3.path();

      Object.keys(plot.aces).map((key, id) => {
        const v = scales[key](d[key]);
        const x =
          v * Math.cos((2 * Math.PI * id) / Object.keys(plot.aces).length);
        const y =
          v * Math.sin((2 * Math.PI * id) / Object.keys(plot.aces).length);
        if (id === 0) p.moveTo(x, y);
        else p.lineTo(x, y);
      });
      p.closePath();
      return p.toString();
    })
    .attr("stroke", (_, i) => colors[i])
    .attr("fill", (_, i) => transparentize(colors[i], 0.8));

  return plt;
};
