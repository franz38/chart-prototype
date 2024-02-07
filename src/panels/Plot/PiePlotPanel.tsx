import { PiePlot, Plot } from "../../state/plots/dto";
import { PlotType } from "../../state/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { updatePlot } from "../../state/plots/plotsSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { Dataset } from "../../state/dto";
import { changeAxisKey } from "../../state/aces/acesSlice";
import { SelectInput } from "../../formComponents/SelectInput";
import { DraftingCompass, Radius, Tag } from "lucide-react";
import { inputIconProps } from "../../formComponents/styleConst";
import { NumberInput } from "../../formComponents/NumberInput";
import { AxisType, CircularAxis } from "../../state/aces/dto";
import { DynamicColor } from "../../formComponents/DynamicColor";
import { Section } from "../../ui-elements/form/Section";
import { HR } from "../../ui-elements/HR";
import { DatasetSelector, PlotTypeSelector } from "./components";


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

            <Section label="Axis">
                <SelectInput
                    label={<Tag {...inputIconProps} />}
                    options={props.dataset?.props.filter(p => p.type === "continous").map(p => p.key).map(p => ({ value: p, label: p }))}
                    value={aces.find(ax => ax.id === plot.circularAxis)?.key}
                    onChange={(val) => dispatch(changeAxisKey({
                        axis: aces.find(ax => ax.id === plot.circularAxis),
                        dataset: props.dataset,
                        newKey: val
                    }))}
                />
            </Section>

            <HR />

            <Section label="Start/end angle">
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
            </Section>

            <HR />

            <Section label="Radius">
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
                    minValue={0}
                    title="Padding angle"
                    label={<Radius  {...inputIconProps} />}
                    value={plot.anglePadding}
                    onChange={(val) => editPlot({ ...plot, anglePadding: val })}
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

            <Section label="Border color">
                <DynamicColor
                    value={plot.borderColor}
                    onChange={(newColor) => editPlot({ ...plot, borderColor: newColor })}
                    dataset={props.dataset}
                />
            </Section>

            <HR />

        </div>

    </>
}