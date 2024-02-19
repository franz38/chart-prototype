import { ISelectable } from "../dto";
import { Rect } from "../dto";

export interface Chart extends ISelectable {
  name: string;
  rect: Rect;
  backgroundColor: string;
  padding: number[];
  hidden?: boolean;
  fileName?: string;
}
