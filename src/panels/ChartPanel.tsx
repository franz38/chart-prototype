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


export const ChartPanel = (props: { onExport: () => void, onGetCode: () => void }) => {

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
                    label={<span className="text-xs">X</span>}
                    value={chart.rect.x}
                    onChange={(val) => dispatch(moveX(val))}
                />
                <NumberInput
                    label={<span className="text-xs">Y</span>}
                    value={chart.rect.y}
                    onChange={(val) => dispatch(moveY(val))}
                />
                <NumberInput
                    label={<span className="text-xs">W</span>}
                    value={chart.rect.w}
                    onChange={(val) => dispatch(resizeW(val))}
                />
                <NumberInput
                    label={<span className="text-xs">H</span>}
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
                    label={<span className="text-xs">T</span>}
                    value={chart.padding[0]}
                    onChange={(val) => editPadding((val as number), 0)}
                />
                <NumberInput
                    title="Right"
                    label={<span className="text-xs">R</span>}
                    value={chart.padding[1]}
                    onChange={(val) => editPadding((val as number), 1)}
                />
                <NumberInput
                    title="Left"
                    label={<span className="text-xs">L</span>}
                    value={chart.padding[3]}
                    onChange={(val) => editPadding((val as number), 3)}
                />
                <NumberInput
                    title="Bottom"
                    label={<span className="text-xs">B</span>}
                    value={chart.padding[2]}
                    onChange={(val) => editPadding((val as number), 2)}
                />
            </Section>

            <HR />

            {(plot && (plot.type === PlotType.SCATTER || plot.type === PlotType.LINE)) && <>
                <Section label="Show grid">
                    <CheckInput
                        label={<span className="text-xs">X</span>}
                        value={(aces.find(ax => (ax as LinearAxis).position == AxisPosition.BOTTOM) as LinearAxis)?.showGrid ?? false}
                        onChange={v => {
                            const ax = aces.find(ax => (ax as LinearAxis).position == AxisPosition.BOTTOM)
                            if (ax)
                                dispatch(updateAxis({ ...ax, showGrid: v }))
                        }}
                    />
                    <CheckInput
                        label={<span className="text-xs">Y</span>}
                        value={(aces.find(ax => (ax as LinearAxis).position == AxisPosition.LEFT) as LinearAxis)?.showGrid ?? false}
                        onChange={v => {
                            const ax = aces.find(ax => (ax as LinearAxis).position == AxisPosition.LEFT)
                            if (ax)
                                dispatch(updateAxis({ ...ax, showGrid: v }))
                        }}
                    />
                </Section>
            </>}

            {false && <HR />}

            {false && <Section label="Export">
                <button onClick={() => props.onExport()}>get svg</button>
                <button onClick={() => props.onGetCode()}>get code</button>
            </Section>}

        </div>
    </>
}