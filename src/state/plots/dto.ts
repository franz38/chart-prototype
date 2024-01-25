import { PlotType } from "../dto";
import { ISelectable } from "../dto";

export interface DynamicAttribute<K, T> {
  key: string;
  domain: K[];
  range: T[];
}

export interface ScatterPlotProps {
  color: string;
  size: number;
}

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

export interface PiePlotProps {
  radius: number;
  innerradius: number;
  color: string;
  anglePadding: number;
  startAngle: number;
  endAngle: number;
}

export interface ScatterPlot extends ISelectable {
  name: string;
  type: PlotType;
  xAxis: string;
  yAxis: string;
  plotProps: ScatterPlotProps;
}

export interface PiePlot extends ISelectable {
  name: string;
  type: PlotType;
  circularAxis: string;
  plotProps: PiePlotProps;
}

export interface SpiderPlot extends ISelectable {
  name: string;
  type: PlotType;
  aces: string[];
  plotProps: SpiderPlotProps;
}

export type Plot = ScatterPlot | PiePlot | SpiderPlot;

export const newScatterPlot = (xAxis?: string, yAxis?: string): ScatterPlot => {
  return {
    name: "plott",
    type: PlotType.SCATTER,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    plotProps: {
      size: 3,
      color: "steelblue"
    } as ScatterPlotProps,
  };
};

export const newLinePlot = (xAxis?: string, yAxis?: string): Plot => {
  return {
    name: "plott",
    type: PlotType.LINE,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    plotProps: {
      color: "steelblue",
      size: 3,
    } as LinePlotProps,
  };
};

export const newColumnsPlot = (xAxis?: string, yAxis?: string): Plot => {
  return {
    name: "plott",
    type: PlotType.SCATTER,
    xAxis: xAxis ?? "",
    yAxis: yAxis ?? "",
    plotProps: {
      color: "steelblue",
      size: 3,
    } as BarPlotProps,
  };
};

export const newPiePlot = (circularAxis?: string): PiePlot => {
  return {
    name: "plott",
    type: PlotType.PIE,
    circularAxis: circularAxis ?? "",
    plotProps: {
      radius: 100,
      innerradius: 20,
      color: "steelblue",
      anglePadding: 0,
      startAngle: 0,
      endAngle: 360,
    } as PiePlotProps,
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
      fillColor: "red"
    } as SpiderPlotProps,
  };
};

