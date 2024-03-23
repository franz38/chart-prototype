import { NumericScale } from "../aces/dto";
import { PlotType } from "../dto";
import { ISelectable } from "../dto";

export interface DynamicAttribute<K, T> {
  key: string;
  domain: K[];
  range: T[];
}

export interface DynamicContinuous<D, R> {
  fixedValue: R;
  key?: string;
  range?: R[];
  domain?: D[];
}

// /***
//  *
//  * linear:
//  *  - number[] => number[] (es size)
//  *  - number[] => string[] (es color)
//  *
//  * ordinal:
//  *  - string[] => string[]
//  *
//  */

export interface ScatterPlot extends ISelectable {
  name: string;
  label: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  color: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  size: DynamicContinuous<number, number>;
}

export interface LinePlot extends ISelectable {
  name: string;
  label: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  color: string;
  fill: string;
  size: number;
}

export interface PiePlot extends ISelectable {
  name: string;
  label: string;
  type: PlotType;
  circularAxis: string;
  radius: number;
  innerradius: number;
  color: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  borderColor:
    | DynamicContinuous<number, string>
    | DynamicContinuous<string, string>;
  anglePadding: number;
  startAngle: number;
  endAngle: number;
}

export interface BarPlot extends ISelectable {
  name: string;
  label: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  fill: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  color: string;
  size: number;
  padding: number;
}

export interface SpiderPlot extends ISelectable {
  name: string;
  label: string;
  type: PlotType;
  aces: { [id: string]: NumericScale };
  axisLenght: number;
  innerLinesStyle: "straight" | "curve";
  innerLines: number;
  innerLinesColor: string;
  innerLinesThickness: number;
  innerLinesStrokeColor: string;
  acesLinesColor: string;
  acesLinesThickness: number;
  areaStrokeColor: string;
  areaColor: string;
  axisLabelColor: string;
  axisLabelSize: number;
  axisLabelDistance: number;
  colors: string[];
}

export type Plot = ScatterPlot | PiePlot | SpiderPlot | LinePlot | BarPlot;

export const isScatter = (plot: Plot): plot is ScatterPlot => {
  const plt = plot as ScatterPlot;
  return !!plt.xAxis && !!plt.yAxis && !(plot as LinePlot).fill;
};

export const isLine = (plot: Plot): plot is LinePlot => {
  const plt = plot as LinePlot;
  return !!plt.xAxis && !!plt.yAxis && !!plt.fill && !(plot as BarPlot).padding;
};

export const isBar = (plot: Plot): plot is BarPlot => {
  const plt = plot as BarPlot;
  return !!plt.xAxis && !!plt.yAxis && !!plt.fill && !!plt.padding;
};

export const isPie = (plot: Plot): plot is PiePlot => {
  return !!(plot as PiePlot).circularAxis;
};

export const isSpider = (plot: Plot): plot is SpiderPlot => {
  return !!(plot as SpiderPlot).aces;
};

export const newScatterPlot = (xAxis?: string, yAxis?: string): ScatterPlot => {
  return {
    name: "plott",
    label: "Scatter",
    type: PlotType.SCATTER,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    size: { fixedValue: 5 },
    color: { fixedValue: "steelblue" },
  };
};

export const newLinePlot = (xAxis?: string, yAxis?: string): LinePlot => {
  return {
    name: "plott",
    label: "Line",
    type: PlotType.LINE,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    color: "steelblue",
    fill: "#4682b440",
    size: 3,
  };
};

export const newColumnsPlot = (xAxis?: string, yAxis?: string): LinePlot => {
  return {
    name: "plott",
    label: "Columns",
    type: PlotType.SCATTER,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    color: "steelblue",
    fill: "#4682b440",
    size: 3,
  };
};

export const newBarPlot = (xAxis?: string, yAxis?: string): BarPlot => {
  return {
    name: "plott",
    label: "Bar",
    type: PlotType.BAR,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    color: "#4682b440",
    fill: { fixedValue: "steelblue" },
    size: 1,
    padding: 2,
  };
};

export const newPiePlot = (circularAxis?: string): PiePlot => {
  return {
    name: "plott",
    label: "Pie",
    type: PlotType.PIE,
    circularAxis: circularAxis ?? "",
    radius: 100,
    innerradius: 30,
    color: { fixedValue: "steelblue" },
    borderColor: { fixedValue: "#0000009a" },
    anglePadding: 5,
    startAngle: 0,
    endAngle: 360,
  };
};

export const newSpiderPlot = (
  aces?: {
    key: string;
    type: "discrete" | "continous";
    extent: any[];
  }[],
): SpiderPlot => {
  return {
    name: "plott",
    label: "Spider",
    type: PlotType.SPIDER,
    aces: (aces ?? []).reduce(
      (acc, cur) => {
        let range = (cur.extent[1] - cur.extent[0])
        acc[cur.key] = { domain: [Math.max(cur.extent[0] - range*0.5,0), cur.extent[1]+range*0.1], range: [0, 200] };
        return acc;
      },
      {} as { [id: string]: NumericScale },
    ),
    axisLenght: 200,
    innerLinesStyle: "curve",
    innerLines: 5,
    innerLinesColor: "#00000010",
    innerLinesStrokeColor: "#00000025",
    areaStrokeColor: "#ff0000",
    areaColor: "#ff000025",
    acesLinesColor: "#00000025",
    acesLinesThickness: 1,
    innerLinesThickness: 1,
    axisLabelColor: "#000000",
    axisLabelSize: 10,
    axisLabelDistance: 25,
    colors: ["#f2cc8f", "#81b29a", "#3d405b", "#e07a5f", "#f4f1de"]
  };
};
