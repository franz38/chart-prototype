import { AxisPosition, LinearAxis } from "../state/aces/dto";
import { NumberInput } from "../formComponents/NumberInput";
import { ColorInput } from "../formComponents/ColorInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { moveX, moveY, resizeW, resizeH, setColor, setPadding } from "../state/chart/chartSlice";
import { CheckInput } from "../formComponents/CheckInput";
import { updateAxis } from "../state/aces/acesSlice";
import { PlotType } from "../state/dto";
import { Section } from "../ui-elements/form/Section";
import { HR } from "../ui-elements/HR";


export const ChartPanel = () => {

    const dispatch = useDispatch()
    const chart = useSelector((state: RootState) => state.chart)
    const aces = useSelector((state: RootState) => state.aces)
    const plot = useSelector((state: RootState) => state.plots)[0]

    const editPadding = (value: number, pos: number) => {
        dispatch(setPadding({ value: value, id: pos }))
    }

    return <>
        <div className="text-left flex flex-col gap-y-4">

            <span></span>

            <Section label="Layout">
                <NumberInput
                    label="X"
                    value={chart.rect.x}
                    onChange={(val) => dispatch(moveX(val))}
                />
                <NumberInput
                    label="Y"
                    value={chart.rect.y}
                    onChange={(val) => dispatch(moveY(val))}
                />
                <NumberInput
                    label="W"
                    value={chart.rect.w}
                    onChange={(val) => dispatch(resizeW(val))}
                />
                <NumberInput
                    label="H"
                    value={chart.rect.h}
                    onChange={(val) => dispatch(resizeH(val))}
                />
            </Section>

            <HR />

            <Section label="Background">
                <ColorInput
                    value={chart.backgroundColor}
                    onChange={val => dispatch(setColor(val))}
                />
            </Section>

            <HR />

            <Section label="Padding">
                <NumberInput
                    title="Top"
                    label={"T"}
                    value={chart.padding[0]}
                    onChange={(val) => editPadding((val as number), 0)}
                />
                <NumberInput
                    title="Right"
                    label={"R"}
                    value={chart.padding[1]}
                    onChange={(val) => editPadding((val as number), 1)}
                />
                <NumberInput
                    title="Left"
                    label={"L"}
                    value={chart.padding[3]}
                    onChange={(val) => editPadding((val as number), 3)}
                />
                <NumberInput
                    title="Bottom"
                    label={"B"}
                    value={chart.padding[2]}
                    onChange={(val) => editPadding((val as number), 2)}
                />
            </Section>

            <HR />

            {(plot && (plot.type === PlotType.SCATTER || plot.type === PlotType.LINE)) && <>
                <Section label="Show grid">
                    <CheckInput
                        label={"X"}
                        value={(aces.find(ax => (ax as LinearAxis).position == AxisPosition.BOTTOM) as LinearAxis)?.showGrid ?? false}
                        onChange={v => {
                            const ax = aces.find(ax => (ax as LinearAxis).position == AxisPosition.BOTTOM)
                            if (ax)
                                dispatch(updateAxis({ ...ax, showGrid: v }))
                        }}
                    />
                    <CheckInput
                        label={"Y"}
                        value={(aces.find(ax => (ax as LinearAxis).position == AxisPosition.LEFT) as LinearAxis)?.showGrid ?? false}
                        onChange={v => {
                            const ax = aces.find(ax => (ax as LinearAxis).position == AxisPosition.LEFT)
                            if (ax)
                                dispatch(updateAxis({ ...ax, showGrid: v }))
                        }}
                    />
                </Section>
            </>}

        </div>
    </>
}