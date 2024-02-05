import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Chart } from "./dto";

const initialState: Chart = {
  name: "",
  rect: { x: 400, y: 100, w: 400, h: 200 },
  backgroundColor: "#DFECFF",
  padding: [50, 50, 50, 50],
  hidden: true
};

const chartSlice = createSlice({
  name: "chart",
  initialState: initialState,
  reducers: {
    show: (state, action: PayloadAction<{width: number, height: number}>) => {
      state.rect.x = Math.max(action.payload.width/2 - state.rect.w/2, 0)
      state.rect.y = Math.max(action.payload.height/2 - state.rect.h/2, 0)
      state.hidden = false;
    },
    moveX: (state, action: PayloadAction<number>) => {
      state.rect = { ...state.rect, x: action.payload };
    },
    moveY: (state, action: PayloadAction<number>) => {
      state.rect = { ...state.rect, y: action.payload };
    },
    drag: (state, action: PayloadAction<{ dx: number; dy: number }>) => {
      state.rect.x += action.payload.dx;
      state.rect.y += action.payload.dy;
    },
    resizeW: (state, action: PayloadAction<number>) => {
      state.rect = { ...state.rect, w: action.payload };
    },
    resizeH: (state, action: PayloadAction<number>) => {
      state.rect = { ...state.rect, h: action.payload };
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
    setPadding: (
      state,
      action: PayloadAction<{ value: number; id: number }>
    ) => {
      state.padding[action.payload.id] = action.payload.value;
    },
    handle1: (state, action: PayloadAction<{ dx: number; dy: number }>) => {
      // if (state.rect.w - action.payload.dx > 50){
      state.rect.x += action.payload.dx;
      state.rect.y += action.payload.dy;
      state.rect.w -= action.payload.dx;
      state.rect.h -= action.payload.dy;
      // }
    },
    handle2: (state, action: PayloadAction<{ dx: number; dy: number }>) => {
      state.rect.y += action.payload.dy;
      // state.rect.w += action.payload.dx
      state.rect.w += action.payload.dx;
      state.rect.h -= action.payload.dy;
    },
    handle3: (state, action: PayloadAction<{ dx: number; dy: number }>) => {
      state.rect.w += action.payload.dx;
      state.rect.h += action.payload.dy;
    },
    handle4: (state, action: PayloadAction<{ dx: number; dy: number }>) => {
      state.rect.y += action.payload.dy;
      // state.rect.w += action.payload.dx
      state.rect.w += action.payload.dx;
      state.rect.h -= action.payload.dy;
    },
  },
});

export const {
  moveX,
  moveY,
  resizeH,
  resizeW,
  setColor,
  setPadding,
  handle1,
  handle2,
  handle3,
  handle4,
  drag,
  show
} = chartSlice.actions;
export default chartSlice.reducer;
