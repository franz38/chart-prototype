import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Plot,
  newColumnsPlot,
  newLinePlot,
  newPiePlot,
  newScatterPlot,
} from "./dto";
import { PlotType } from "../dto";

const plotsSlice = createSlice({
  name: "selected",
  initialState: [] as Plot[],
  reducers: {
    updatePlot: (state, action: PayloadAction<Plot>) => {
      state.forEach((plt, id) => {
        if (plt.name === action.payload.name) state[id] = action.payload;
      });
    },
    addPlot: (state, action: PayloadAction<Plot>) => {
      return [...state, action.payload];
    },
    changePlotType: (
      state,
      action: PayloadAction<{ plot: Plot; newType: PlotType }>
    ) => {
      state.forEach((plt, id) => {
        if (plt.name === action.payload.plot.name) {
          switch (action.payload.newType) {
            case PlotType.SCATTER:
              state[id] = newScatterPlot();
              break;
            case PlotType.LINE:
              state[id] = newLinePlot();
              break;
            case PlotType.PIE:
              state[id] = newPiePlot();
              break;
            case PlotType.COLUMNS:
              state[id] = newColumnsPlot();
              break;
            default:
              state[id] = newScatterPlot();
              break;
          }
        }
      });
    },
  },
});

export const { updatePlot, addPlot, changePlotType } = plotsSlice.actions;
export default plotsSlice.reducer;
