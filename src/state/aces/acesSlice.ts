import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  LinearAxis,
  AxisPosition,
  Scale,
  Axis,
  RadarAxis,
  AxisType,
  CircularAxis,
} from "./dto";
import { Dataset } from "../dto";
import { getColumn } from "../../utils/data";

const testSlice = createSlice({
  name: "aces",
  initialState: [] as Axis[],
  reducers: {
    updateAxis: (state, action: PayloadAction<Axis>) => {
      state.forEach((ax, id) => {
        if (ax.id === action.payload.id) state[id] = action.payload;
      });
    },
    setAces: (_state, action: PayloadAction<Axis[]>) => {
      return action.payload;
    },
    addAces: (state, action: PayloadAction<Axis[]>) => {
      return [...state, ...action.payload];
    },
    changeAxisKey: (
      state,
      action: PayloadAction<{
        axis: Axis | undefined;
        dataset: Dataset | undefined;
        newKey: string;
      }>
    ) => {
      if (!action.payload.axis || !action.payload.dataset) return;
      const data = getColumn(action.payload.dataset, action.payload.newKey);

      if (action.payload.axis.type === AxisType.Linear){
        const axis = action.payload.axis as LinearAxis;
  
        if (axis.position === AxisPosition.CIRCULAR) {
          state.forEach((ax, id) => {
            if (ax.id === axis.id) {
              state[id] = { ...axis, key: action.payload.newKey };
            }
          });
        } else if (typeof data[0] === "number") {
          const newScale: Scale = {
            ...axis.scale,
            type: "linear",
            props: {
              ...axis.scale.props,
              domain: [Math.min(...data), Math.max(...data)],
            },
          };
          state.forEach((ax, id) => {
            if (ax.id === axis.id) {
              state[id] = {
                ...axis,
                key: action.payload.newKey,
                scale: newScale,
              };
            }
          });
        } else if (typeof data[0] === "string") {
          const newScale: Scale = {
            ...axis.scale,
            type: "band",
            props: {
              ...axis.scale.props,
              domain: Array.from(
                new Set<string>(data.map((d) => d as string)).values()
              ),
            },
          };
          state.forEach((ax, id) => {
            if (ax.id === axis.id) {
              state[id] = {
                ...axis,
                key: action.payload.newKey,
                scale: newScale,
              };
            }
          });
        }

      }
      else if (action.payload.axis.type === AxisType.Circular){
        const axis = action.payload.axis as CircularAxis;
        state.forEach((ax, id) => {
          if (ax.id === axis.id) {
            state[id] = { ...axis, key: action.payload.newKey };
          }
        });
      }


      return state;
    },
    changeRadarAxisKey: (
      state,
      action: PayloadAction<{
        axis: RadarAxis;
        dataset: Dataset | undefined;
        newKey: string;
      }>
    ) => {
      if (!action.payload.dataset) return;
      const data = getColumn(action.payload.dataset, action.payload.newKey);
      const newAxis: RadarAxis = {
        ...action.payload.axis,
        key: action.payload.newKey,
        scale: {
          ...action.payload.axis.scale,
          props: {
            ...action.payload.axis.scale.props,
            domain: [Math.min(...data), Math.max(...data)],
          },
        },
      };
      return state.map((ax) => {
        if (ax.id === action.payload.axis.id) return newAxis;
        return ax;
      });
    },
  },
});

export const { setAces, updateAxis, changeAxisKey, changeRadarAxisKey, addAces } =
  testSlice.actions;
export default testSlice.reducer;
