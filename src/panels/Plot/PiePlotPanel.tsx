import { Typography, Flex, Form, Select, Divider } from "antd";
import { PiePlot, PiePlotProps, Plot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { panelSection, sectionHeader } from "../interfaceUtils";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { DraftingCompass, Radius, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { ColorInput } from "../../formComponents/ColorInput";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, LinearAxis } from "../../state/aces/dto";

const { Text } = Typography;

interface IAxisPanel {
    dataset: Dataset | undefined;
    changePlotType: (plot: Plot, newType: PlotType) => void;
}

export const PiePlotPanel = (props: IAxisPanel) => {

    const dispatch = useDispatch()
    const plot = useSelector((state: RootState) => state.plots.find(plt => plt.name === (state.selection.selection as Selection).key)) as PiePlot
    const aces = useSelector((state: RootState) => state.aces).filter(ax => ax.type === AxisType.Linear) as LinearAxis[]

    const changePlotProps = (plotProps: PiePlotProps) => {
        editPlot({ ...plot, plotProps: plotProps })
    }

    const editPlot = (plt: PiePlot) => {
        dispatch(updatePlot(plt))
    }

    // useEffect(() => {
    //     if (!plot.xAxis && !plot.yAxis) {
    //         const xAxis = aces.find(ax => !isVertical(ax))
    //         const yAxis = aces.find(ax => isVertical(ax))
    //         if (xAxis && yAxis) {
    //             dispatch(updatePlot({
    //                 ...plot,
    //                 xAxis: xAxis.key,
    //                 yAxis: yAxis.key
    //             }))
    //         }
    //     }
    // }, [aces])

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
                        { value: PlotType.PIE, label: "Pie/Donuts" },
                        { value: PlotType.SPIDER, label: "Spider" }
                    ]}
                    value={plot.type}
                    onChange={(val) => props.changePlotType(plot, val)}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader}>Axis</Text>
            <SelectInput
                label={<Tag {...inputIconProps} />}
                options={props.dataset?.props.map(p => ({ value: p, label: p }))}
                value={aces.find(ax => ax.id === plot.circularAxis)?.key}
                onChange={(val) => dispatch(changeAxisKey({
                    axis: aces.find(ax => ax.id === plot.circularAxis),
                    dataset: props.dataset,
                    newKey: val
                }))}
            />

            <Divider />

            <Text {...sectionHeader} >Start/end angle</Text>
            <Flex {...panelSection}>
                <NumberInput
                    title="Start angle"
                    label={<DraftingCompass  {...inputIconProps} />}
                    value={plot.plotProps.startAngle}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, startAngle: val })}
                />
                <NumberInput
                    title="End angle"
                    label={<DraftingCompass  {...inputIconProps} />}
                    value={plot.plotProps.endAngle}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, endAngle: val })}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader} >Radius</Text>
            <Flex {...panelSection}>
                <NumberInput
                    title="Inner radius"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.plotProps.innerradius}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, innerradius: val })}
                    minValue={0}
                />
                <NumberInput
                    title="Radius"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.plotProps.radius}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, radius: val })}
                    minValue={0}
                />
                <NumberInput
                    title="Padding angle"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.plotProps.anglePadding}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, anglePadding: val })}
                />
            </Flex>


            <Divider />

            <Text {...sectionHeader} >Color</Text>
            <Flex {...panelSection}>
                {(typeof plot.plotProps.color === "string") && 
                    <ColorInput
                    value={plot.plotProps.color}
                    onChange={(val) => changePlotProps({ ...plot.plotProps, color: val })}
                    />
                }
                {typeof plot.plotProps.color !== "string" && <>
                
                </>}
            </Flex>

            <Divider />


        </Form>

    </>
}