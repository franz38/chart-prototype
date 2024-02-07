import { useEffect } from "react";
import { BarPlot, Plot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { isVertical } from "../../utils/axis";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { AlignHorizontalSpaceAround, Move3D, Ruler, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { ColorInput } from "../../formComponents/ColorInput";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, LinearAxis } from "../../state/aces/dto";
import { Section } from "../../ui-elements/form/Section";
import { HR } from "../../ui-elements/HR";
import { DynamicColor } from "../../formComponents/DynamicColor";
import { DatasetSelector, PlotTypeSelector } from "./components";


interface IAxisPanel {
    dataset: Dataset | undefined;
    changePlotType: (plot: Plot, newType: PlotType) => void;
}

export const BarPlotPanel = (props: IAxisPanel) => {

    const dispatch = useDispatch()
    const plot = useSelector((state: RootState) => state.plots.find(plt => plt.name === (state.selection.selection as Selection).key)) as BarPlot
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

    const editPlot = (plt: BarPlot) => {
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
        <div className="text-left flex flex-col gap-y-4">

            <span></span>

            <DatasetSelector
                datasets={props.dataset ? [props.dataset] : []}
            />

            <PlotTypeSelector
                plot={plot}
                onChange={(val) => props.changePlotType(plot, val)}
            />

            <HR />

            <Section label="X Axis">
                <SelectInput
                    label={<Move3D {...inputIconProps} />}
                    options={aces.filter(ax => !isVertical(ax)).map(ax => ({ value: ax.id, label: ax.id }))}
                    value={plot.xAxis}
                    onChange={(val) => updateKeyProps(val, "x")}
                    readonly={aces.filter(ax => !isVertical(ax)).length === 1}
                />
                <SelectInput
                    label={<Tag {...inputIconProps} />}
                    options={props.dataset?.props.map(p => p.key).map(p => ({ value: p, label: p }))}
                    value={aces.find(ax => ax.id === plot.xAxis)?.key}
                    onChange={(val) => dispatch(changeAxisKey({
                        axis: aces.find(ax => ax.id === plot.xAxis),
                        dataset: props.dataset,
                        newKey: val
                    }))}
                />
            </Section>

            <HR />

            <Section label="Y Axis">
                <SelectInput
                    label={<Move3D {...inputIconProps} />}
                    options={aces.filter(ax => isVertical(ax)).map(ax => ({ value: ax.id, label: ax.id }))}
                    value={plot.yAxis}
                    onChange={(val) => updateKeyProps(val, "y")}
                    readonly={aces.filter(ax => isVertical(ax)).length === 1}
                />
                <SelectInput
                    label={<Tag {...inputIconProps} />}
                    options={props.dataset?.props.map(p => p.key).map(p => ({ value: p, label: p }))}
                    value={aces.find(ax => ax.id === plot.yAxis)?.key}
                    onChange={(val) => dispatch(changeAxisKey({
                        axis: aces.find(ax => ax.id === plot.yAxis),
                        dataset: props.dataset,
                        newKey: val
                    }))}
                />
            </Section>

            <HR />

            <Section label="Layout">
                <NumberInput
                    minValue={0}
                    label={<AlignHorizontalSpaceAround  {...inputIconProps} />}
                    value={plot.padding}
                    onChange={(val) => editPlot({ ...plot, padding: val })}
                />
            </Section>

            <HR />

            <Section label="Color">
                <DynamicColor
                    value={plot.fill}
                    onChange={(newColor) => editPlot({ ...plot, fill: newColor })}
                    dataset={props.dataset}
                />
            </Section>

            <Section label="Border">
                <ColorInput
                    value={plot.color}
                    onChange={(val) => editPlot({ ...plot, color: val })}
                />
                <NumberInput
                    minValue={0}
                    label={<Ruler  {...inputIconProps} />}
                    value={plot.size}
                    onChange={(val) => editPlot({ ...plot, size: val })}
                />
            </Section>

            <HR />

        </div>

    </>
}