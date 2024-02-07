import { configureStore } from '@reduxjs/toolkit'
import testReducer from './chart/chartSlice'
import acesReducer from './aces/acesSlice'
import selectionReducer from "./selected/selectedSlice"
import plotsSlice from "./plots/plotsSlice"
import layoutSlice from './layout/layoutSlice'


export const store = configureStore({
    reducer: {
        chart: testReducer,
        aces: acesReducer,
        selection: selectionReducer,
        plots: plotsSlice,
        layout: layoutSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch