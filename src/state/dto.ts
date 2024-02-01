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
  props: string[];
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
  COLUMNS = "COLUMNS",
  PIE = "PIE",
  CIRCULAR_BAR = "CIRCULAR_BAR",
  SPIDER = "SPIDER"
}
