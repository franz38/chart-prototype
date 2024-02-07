import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LayoutData {
  mainPanelVisible: boolean;
  mainPanelMinified: boolean;
}

const initialState: LayoutData = {
  mainPanelVisible: false,
  mainPanelMinified: false,
};

const plotsSlice = createSlice({
  name: "layout",
  initialState: initialState,
  reducers: {
    toggleMainPanelSize: (state, _action: PayloadAction<void>) => {
      return { ...state, mainPanelMinified: !state.mainPanelMinified };
    },
    toggleMainPanel: (state, _action: PayloadAction<void>) => {
      return { ...state, mainPanelVisible: !state.mainPanelVisible };
    },
  },
});

export const { toggleMainPanel, toggleMainPanelSize } = plotsSlice.actions;
export default plotsSlice.reducer;
