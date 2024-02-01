import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Plot,
} from "./dto";

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
    replacePlot: (state, action: PayloadAction<{ new: Plot; old: Plot }>) => {
      return [
        action.payload.new,
        ...state.filter((plt) => plt.name !== action.payload.old.name),
      ];
    },
    removePlot: (state, action: PayloadAction<Plot>) => {
      return [...state.filter((plt) => plt.name !== action.payload.name)];
    },
  },
});

export const { updatePlot, addPlot, replacePlot, removePlot } =
  plotsSlice.actions;
export default plotsSlice.reducer;
