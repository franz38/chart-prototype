import * as d3 from "d3";
import { BaseType } from "d3";
import { isVertical } from "./axis";
import { LinearAxis, NumericScale, BandScale } from "../state/aces/dto";
import { Rect } from "../state/dto";

export const d3ExistOrAppend = <
  GElement extends BaseType,
  Datum,
  PElement extends BaseType,
  PDatum
>(
  selection: d3.Selection<GElement, Datum, PElement, PDatum>,
  createSelection: () => d3.Selection<GElement, Datum, PElement, PDatum>
) => {
  if (selection.size()) return selection;
  return createSelection();
};
export const buildScale = (axis: LinearAxis, chartRect: Rect) => {
  let range = [0, 1];
  if (isVertical(axis)) {
    if (axis.invert) range = [chartRect.h, 0];
    else range = [0, chartRect.h];
  } else {
    if (axis.invert) range = [chartRect.w, 0];
    else range = [0, chartRect.w];
  }

  if (axis.scale.type === "linear") {
    const scaleProps = axis.scale.props as NumericScale;
    return d3.scaleLinear().domain(scaleProps.domain).range(range);
  } else if (axis.scale.type === "band") {
    const scaleProps = axis.scale.props as BandScale;
    return d3.scaleBand().domain(scaleProps.domain).range(range);
  }

  return d3.scaleLinear();
};
