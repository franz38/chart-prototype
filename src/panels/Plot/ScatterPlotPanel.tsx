import { useEffect } from "react";
import { Plot, ScatterPlot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { isVertical } from "../../utils/axis";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { Move3D, Ruler, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, LinearAxis } from "../../state/aces/dto";
import { getRange } from "../../utils/data";
import { DynamicColor } from "../../formComponents/DynamicColor";
import { HR } from "../../ui-elements/HR";
import { Section } from "../../ui-elements/form/Section";
import { DatasetSelector, PlotTypeSelector } from "./components";


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

    return <div className="text-left flex flex-col gap-y-4">

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

        <Section label="Color">
            <DynamicColor
                value={plot.color}
                onChange={(newColor) => editPlot({ ...plot, color: newColor })}
                dataset={props.dataset}
            />
        </Section>

        <HR />


        <Section label="Size">
            <SelectInput
                label={<Tag {...inputIconProps} />}
                options={[{ value: "fixed", label: "fixed" }, ...props.dataset?.props.map(p => p.key).map(p => ({ value: p, label: p })) ?? []]}
                value={plot.size.key ? plot.size.key : "fixed"}
                onChange={(val) => {
                    if (val !== "fixed")
                        editPlot({ ...plot, size: { ...plot.size, key: val, domain: getRange(props.dataset, val) as number[], range: plot.size.range ?? [2, 5] } })
                    else
                        editPlot({ ...plot, size: { ...plot.size, key: undefined } })
                }}
            />
            {!plot.size.key &&
                <NumberInput
                    label={<Ruler  {...inputIconProps} />}
                    value={plot.size.fixedValue}
                    onChange={(val) => editPlot({ ...plot, size: { ...plot.size, fixedValue: val } })}
                />
            }
            {plot.size.key && <>
                <NumberInput
                    minValue={0}
                    label={<Ruler  {...inputIconProps} />}
                    value={(plot.size.range as number[])[0]}
                    onChange={(val) => editPlot({ ...plot, size: { ...plot.size, range: [val, (plot.size.range as number[])[1]] } })}
                />
                <NumberInput
                    minValue={0}
                    label={<Ruler  {...inputIconProps} />}
                    value={(plot.size.range as number[])[1]}
                    onChange={(val) => editPlot({ ...plot, size: { ...plot.size, range: [(plot.size.range as number[])[0], val] } })}
                />
            </>}
        </Section>



    </div>
}