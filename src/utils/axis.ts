import { LinearAxis, AxisPosition } from "../state/aces/dto";

export const isVertical = (axis: LinearAxis) => {
  if (
    axis.position === AxisPosition.LEFT ||
    axis.position === AxisPosition.RIGTH
  )
    return true;
  return false;
};
