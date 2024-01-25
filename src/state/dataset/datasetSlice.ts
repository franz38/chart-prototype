import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dataset } from "../dto";

const plotsSlice = createSlice({
  name: "dataset",
  initialState: [] as Dataset[],
  reducers: {
    addDataset: (state, action: PayloadAction<Dataset>) => {
      return [...state, action.payload];
    },
  },
});

// export const { updatePlot, addPlot, changePlotType } = plotsSlice.actions;
export default plotsSlice.reducer;
