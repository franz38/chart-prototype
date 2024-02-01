import { Typography, Flex, Form, Divider } from "antd";
import { PiePlot, Plot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { panelSection, sectionHeader } from "../interfaceUtils";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { Box, DraftingCompass, Radius, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, CircularAxis } from "../../state/aces/dto";
import { DynamicColor } from "../../formComponents/DynamicColor";

const { Text } = Typography;

interface IAxisPanel {
    dataset: Dataset | undefined;
    changePlotType: (plot: Plot, newType: PlotType) => void;
}

export const PiePlotPanel = (props: IAxisPanel) => {

    const dispatch = useDispatch()
    const plot = useSelector((state: RootState) => state.plots.find(plt => plt.name === (state.selection.selection as Selection).key)) as PiePlot
    const aces = useSelector((state: RootState) => state.aces).filter(ax => ax.type === AxisType.Circular) as CircularAxis[]

    const editPlot = (plt: PiePlot) => {
        dispatch(updatePlot(plt))
    }

    return <>
        <Form>

            <Text {...sectionHeader}>Plot type</Text>
            <Flex {...panelSection}>
                <SelectInput 
                    label={<Box {...inputIconProps} />}
                    options={[
                        { value: PlotType.LINE, label: "Line" },
                        { value: PlotType.SCATTER, label: "Scatter" },
                        { value: PlotType.PIE, label: "Pie/Donuts" },
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
                    value={plot.startAngle}
                    onChange={(val) => editPlot({ ...plot, startAngle: val })}
                />
                <NumberInput
                    title="End angle"
                    label={<DraftingCompass  {...inputIconProps} />}
                    value={plot.endAngle}
                    onChange={(val) => editPlot({ ...plot, endAngle: val })}
                />
            </Flex>

            <Divider />

            <Text {...sectionHeader} >Radius</Text>
            <Flex {...panelSection}>
                <NumberInput
                    title="Inner radius"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.innerradius}
                    onChange={(val) => editPlot({ ...plot, innerradius: val })}
                    minValue={0}
                />
                <NumberInput
                    title="Radius"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.radius}
                    onChange={(val) => editPlot({ ...plot, radius: val })}
                    minValue={0}
                />
                <NumberInput
                    title="Padding angle"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.anglePadding}
                    onChange={(val) => editPlot({ ...plot, anglePadding: val })}
                />
            </Flex>


            <Divider />

            <Text {...sectionHeader} >Color</Text>
            <Flex {...panelSection} vertical>
                <DynamicColor 
                    value={plot.color}
                    onChange={(newColor) => editPlot({...plot, color: newColor})}
                    dataset={props.dataset}
                />
            </Flex>

            <Divider />


        </Form>

    </>
}