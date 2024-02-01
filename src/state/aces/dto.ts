import { ISelectable } from "../dto";

export enum AxisPosition {
  BOTTOM = "BOTTOM",
  TOP = "TOP",
  LEFT = "LEFT",
  RIGTH = "RIGTH",
  CIRCULAR = "CIRCULAR",
}

export enum AxisType {
  Linear,
  Circular,
  Radial,
}

export interface BandScale {
  domain: string[];
  range: number[];
}

export interface NumericScale {
  domain: number[];
  range: number[];
}

export interface ColorScale {
  domain: number[];
  range: string[];
  key: string;
}

export interface Scale {
  type: "linear" | "band";
  props: BandScale | NumericScale;
}

export interface AxisStyle {
  lineVisible: boolean;
  lineThickness: number;
  lineColor: string;
  tickThickness: number;
  tickColor: string;
  tickVisible: boolean;
  fontColor: string;
  fontSize: number;
  tickTextVisible: boolean;
}

export interface LinearAxis extends ISelectable {
  type: AxisType;
  position: AxisPosition;
  id: string;
  key: string;
  margin: number;
  scale: Scale;
  invert: boolean;
  showGrid: boolean;
  label: string | undefined;
  labelStyle: React.CSSProperties;
  style: AxisStyle;
}

export interface CircularAxis extends ISelectable {
  type: AxisType;
  id: string;
  key: string;
}

export interface RadarAxis extends ISelectable{
  type: AxisType;
  id: string;
  key: string;
  scale: Scale;
}

export type Axis = LinearAxis | CircularAxis | RadarAxis;

const defaultStyle: AxisStyle = {
  lineColor: "#555",
  lineThickness: 1,
  fontColor: "#555",
  tickColor: "#555",
  tickThickness: 1,
  fontSize: 12,
  lineVisible: true,
  tickTextVisible: true,
  tickVisible: true,
};

const defaultScale: Scale = {
  type: "linear",
  props: {
    domain: [0, 1],
    range: [0, 1],
  },
};

// const defaultCircularScale: Scale = {
//   type: "linear",
//   props: {
//     domain: [0, 360],
//     range: [0, 1],
//   },
// };

export const newLeftAxis = (key?: string, id?: string): LinearAxis => ({
  type: AxisType.Linear,
  position: AxisPosition.LEFT,
  margin: 10,
  scale: defaultScale,
  id: id ?? "left axis",
  key: key ?? "",
  invert: true,
  showGrid: false,
  labelStyle: { color: "#555", alignSelf: "center" },
  label: undefined,
  style: defaultStyle,
});

export const newBottomAxis = (key?: string, id?: string): LinearAxis => ({
  type: AxisType.Linear,
  position: AxisPosition.BOTTOM,
  margin: 10,
  scale: defaultScale,
  id: id ?? "bottom axis",
  key: key ?? "",
  invert: false,
  showGrid: false,
  labelStyle: { color: "#555", alignSelf: "center" },
  label: undefined,
  style: defaultStyle,
});

export const newCircularAxis = (key?: string, id?: string): CircularAxis => ({
  type: AxisType.Circular,
  id: id ?? "circular axis",
  key: key ?? "",
});

export const newRadarAxis = (key?: string, id?: string): RadarAxis => ({
  type: AxisType.Circular,
  id: id ?? `${key ?? ""}-radar-axis`,
  key: key ?? "",
  scale: {
    type: "linear",
    props: {
      domain: [0, 1],
      range: [0, 1]
    }
  }
});
