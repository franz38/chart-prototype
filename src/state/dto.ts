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
  SCATTER,
  LINE,
  COLUMNS,
  PIE,
  CIRCULAR_BAR,
  SPIDER
}
