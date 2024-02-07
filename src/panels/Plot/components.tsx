import { Box, Database } from "lucide-react";
import { SelectInput } from "../../formComponents/SelectInput";
import { inputIconProps } from "../../formComponents/styleConst";
import { Section } from "../../ui-elements/form/Section";
import { Dataset, PlotType } from "../../state/dto";
import { Plot } from "../../state/plots/dto";

interface Props {
    plot: Plot;
    onChange: (newPltType: PlotType) => void;
}

export const PlotTypeSelector = (props: Props) => <Section label="Plot type">
<SelectInput
    label={<Box {...inputIconProps} />}
    options={[
        { value: PlotType.LINE, label: "Line" },
        { value: PlotType.SCATTER, label: "Scatter" },
        { value: PlotType.BAR, label: "Bar" },
        { value: PlotType.PIE, label: "Pie/Donuts" },
    ]}
    value={props.plot.type}
    onChange={(val) => props.onChange(val)}
/>
</Section>

export const DatasetSelector = (props: {datasets: Dataset[]}) => <Section label="Dataset">
<SelectInput
    label={<Database {...inputIconProps} />}
    options={[
        { value: props.datasets[0]?.file.name ?? "" , label: props.datasets[0]?.file.name ?? "" },
    ]}
    value={props.datasets[0]?.file.name ?? "" }
    onChange={(_) => {}}
    readonly
/>
</Section>