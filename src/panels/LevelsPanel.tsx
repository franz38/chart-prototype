import React from "react";
import { Button } from "antd";
import { Plot } from "../state/plots/dto";
import { PlotType } from "../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setSelected } from "../state/selected/selectedSlice";
import { Move3D, Box, ScatterChart, LineChart, BarChart, PieChart, HelpCircle } from "lucide-react"
import { AxisType } from "../state/aces/dto";

const iconAttributes = {
    size: 14,
    color: "rgba(0, 0, 0, 0.88)",
}

const buttonStyle: React.CSSProperties = {
    width: "100%",
    textAlign: "start",
    borderRadius: 0,
    height: "2.5rem"
}

const getPlotIcon = (plot: Plot) => {
    switch (plot.type) {
        case PlotType.SCATTER:
            return <ScatterChart {...iconAttributes} />
        case PlotType.LINE:
            return <LineChart {...iconAttributes} />
        case PlotType.COLUMNS:
            return <BarChart {...iconAttributes} />
        case PlotType.PIE:
            return <PieChart {...iconAttributes} />
        default:
            return <HelpCircle {...iconAttributes} />
    }
}

export const LevelsPanel = () => {

    const dispatch = useDispatch()
    const plots = useSelector((state: RootState) => state.plots)
    const selected = useSelector((state: RootState) => state.selection.selection)
    const aces = useSelector((state: RootState) => state.aces)


    return <div className="flex flex-col pt-2">
        <Button
            type="text"
            icon={<Box {...iconAttributes} />}
            style={{ ...buttonStyle, backgroundColor: (selected && selected.type === "chart") ? "#eee" : "" }}
            onClick={() => dispatch(setSelected({ type: "chart", key: "chart.name" }))}
        >
            Chart
        </Button>
        {
            plots.map(plot =>
                <Button
                    key={plot.type}
                    type="text"
                    icon={getPlotIcon(plot)}
                    style={{ ...buttonStyle, paddingLeft: "2rem", backgroundColor: (selected && plot.name === selected.key) ? "#eee" : "" }}
                    onClick={() => dispatch(setSelected({ type: "plot", key: plot.name }))}
                >{plot.name}</Button>)
        }
        {
            aces.filter(ax => ax.type === AxisType.Linear).map(axis =>
                <Button
                    key={axis.id}
                    type="text"
                    icon={<Move3D {...iconAttributes} />}
                    style={{ ...buttonStyle, paddingLeft: "2rem", backgroundColor: (selected && axis.id == selected.key) ? "#eee" : "" }}
                    onClick={() => dispatch(setSelected({ type: "axis", key: axis.id }))}
                >{axis.id}</Button>)
        }
    </div>

}