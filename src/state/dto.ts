export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface ISelectable {}

interface FileMetaData {
  name: string;
  size: number;
  type: string;
}

export interface Dataset {
  props: { key: string; type: "discrete" | "continous"; extent: any[] }[];
  values: any[];
  file: FileMetaData;
}

export enum ScaleType {
  Linear,
  Band,
}
export enum PlotType {
  SCATTER = "SCATTER",
  LINE = "LINE",
  PIE = "PIE",
  BAR = "BAR",
  SPIDER = "SPIDER",
}
