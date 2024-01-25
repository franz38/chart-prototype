import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Selection {
  key: string;
  type: "chart" | "axis" | "plot";
}

const initialState: { selection: Selection | undefined } = {
  selection: undefined,
};

const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<Selection | undefined>) => {
      if (!action.payload) {
        state.selection = action.payload;
      } else {
        if (!state.selection) {
          state.selection = {
            key: "",
            type: "axis",
          };
        }
        state.selection.key = action.payload.key;
        state.selection.type = action.payload.type;
      }
      // state = {...action.payload}
    },
  },
});

export const { setSelected } = selectedSlice.actions;
export default selectedSlice.reducer;
