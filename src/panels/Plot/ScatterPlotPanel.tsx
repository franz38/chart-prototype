import { useEffect } from "react";
import { Typography, Flex, Form, Select, Divider } from "antd";
import { Plot, ScatterPlot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { isVertical } from "../../utils/axis";
import { panelSection, sectionHeader } from "../interfaceUtils";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { Move3D, Ruler, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { ColorInput } from "../../formComponents/ColorInput";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, LinearAxis } from "../../state/aces/dto";

const { Text } = Typography;

interface IAxisPanel {
    dataset: Dataset | undefined;
    changePlotType: (plot: Plot, newType: PlotType) => void;
}

export const ScatterPlotPanel = (props: IAxisPanel) => {

    const dispatch = useDispatch()
    const plot = useSelector((state: RootState) => state.plots.find(plt => plt.name === (state.selection.selection as Selection).key)) as ScatterPlot
    const aces = useSelector((state: RootState) => state.aces).filter(ax => ax.type === AxisType.Linear) as LinearAxis[]

    const updateKeyProps = (newKey: string, yorx: "x" | "y") => {
        if (!props.dataset) return

        if (yorx == "x") {
            dispatch(updatePlot({
                ...plot,
                xAxis: newKey
            }))
        }
        else {
            dispatch(updatePlot({
                ...plot,
                yAxis: newKey
            }))
        }
    }

    const editPlot = (plt: ScatterPlot) => {
        dispatch(updatePlot(plt))
    }

    useEffect(() => {
        if (!plot.xAxis && !plot.yAxis) {
            const xAxis = aces.find(ax => !isVertical(ax))
            const yAxis = aces.find(ax => isVertical(ax))
            if (xAxis && yAxis) {
                dispatch(updatePlot({
                    ...plot,
                    xAxis: xAxis.key,
                    yAxis: yAxis.key
                }))
            }
        }
    }, [aces])

    return <>
        <Form>

            <Text {...sectionHeader}>Plot type</Text>
            <Flex {...panelSection}>
                <Select
                    style={{ width: "100%" }}
                    options={[
                        { value: PlotType.COLUMNS, label: "Columns" },
                        { value: PlotType.LINE, label: "Line" },
                        { value: PlotType.SCATTER, label: "Scatter" },
                        { value: PlotType.PIE, label: "Pie/Donuts" }
                    ]}
                    value={plot.type}
                    onChange={(val) => props.changePlotType(plot, val)}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader}>X Axis</Text>
            <Flex {...panelSection}>
                <SelectInput
                    label={<Move3D {...inputIconProps} />}
                    options={aces.filter(ax => !isVertical(ax)).map(ax => ({ value: ax.id, label: ax.id }))}
                    value={plot.xAxis}
                    onChange={(val) => updateKeyProps(val, "x")}
                    readonly={aces.filter(ax => !isVertical(ax)).length === 1}
                />
                <SelectInput
                    label={<Tag {...inputIconProps} />}
                    options={props.dataset?.props.map(p => ({ value: p, label: p }))}
                    value={aces.find(ax => ax.id === plot.xAxis)?.key}
                    onChange={(val) => dispatch(changeAxisKey({
                        axis: aces.find(ax => ax.id === plot.xAxis),
                        dataset: props.dataset,
                        newKey: val
                    }))}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader}>Y Axis</Text>
            <Flex {...panelSection}>
                <SelectInput
                    label={<Move3D {...inputIconProps} />}
                    options={aces.filter(ax => isVertical(ax)).map(ax => ({ value: ax.id, label: ax.id }))}
                    value={plot.yAxis}
                    onChange={(val) => updateKeyProps(val, "y")}
                    readonly={aces.filter(ax => isVertical(ax)).length === 1}
                />
                <SelectInput
                    label={<Tag {...inputIconProps} />}
                    options={props.dataset?.props.map(p => ({ value: p, label: p }))}
                    value={aces.find(ax => ax.id === plot.yAxis)?.key}
                    onChange={(val) => dispatch(changeAxisKey({
                        axis: aces.find(ax => ax.id === plot.yAxis),
                        dataset: props.dataset,
                        newKey: val
                    }))}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader} >Color</Text>
            <Flex {...panelSection}>
                <ColorInput
                    value={plot.plotProps.color}
                    onChange={(val) => editPlot({ ...plot, plotProps: { ...plot.plotProps, color: val } })}
                />            
            </Flex>

            <Divider />

            <Text {...sectionHeader} >Size</Text>
            <Flex {...panelSection}>
                <NumberInput
                    label={<Ruler  {...inputIconProps} />}
                    value={plot.plotProps.size}
                    onChange={(val) => editPlot({ ...plot, plotProps: { ...plot.plotProps, size: val } })}
                />
            </Flex>


        </Form>

    </>
}