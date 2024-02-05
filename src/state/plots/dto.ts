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

export interface LinePlotProps {
  color: string;
  size: number;
}

export interface BarPlotProps {
  color: string;
  size: number;
}

export interface SpiderPlotProps {
  color: string;
  fillColor: string;
  size: number;
}

export interface ScatterPlot extends ISelectable {
  name: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  color: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  size: DynamicContinuous<number, number>;
}

export interface LinePlot extends ISelectable {
  name: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  color: string;
  fill: string;
  size: number;
}

export interface PiePlot extends ISelectable {
  name: string;
  type: PlotType;
  circularAxis: string;
  radius: number;
  innerradius: number;
  color: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  borderColor: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
  anglePadding: number;
  startAngle: number;
  endAngle: number;
}

export interface SpiderPlot extends ISelectable {
  name: string;
  type: PlotType;
  aces: string[];
  plotProps: SpiderPlotProps;
}

export type Plot = ScatterPlot | PiePlot | SpiderPlot | LinePlot;

export const newScatterPlot = (xAxis?: string, yAxis?: string): ScatterPlot => {
  return {
    name: "plott",
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
    type: PlotType.SCATTER,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    color: "steelblue",
    fill: "#4682b440",
    size: 3,
  };
};

export const newPiePlot = (circularAxis?: string): PiePlot => {
  return {
    name: "plott",
    type: PlotType.PIE,
    circularAxis: circularAxis ?? "",
    radius: 100,
    innerradius: 20,
    color: { fixedValue: "steelblue" },
    borderColor: {fixedValue: "#000000"},
    anglePadding: 0,
    startAngle: 0,
    endAngle: 360,
  };
};

export const newSpiderPlot = (aces?: string[]): SpiderPlot => {
  return {
    name: "plott",
    type: PlotType.SPIDER,
    aces: aces ?? [],
    plotProps: {
      color: "steelblue",
      size: 3,
      fillColor: "#4682b440",
    } as SpiderPlotProps,
  };
};
