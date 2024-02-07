import { LinearAxis, AxisStyle, AxisPosition, Scale } from "../../state/aces/dto";
import { NumberInput } from "../../formComponents/NumberInput";
import { ColorInput } from "../../formComponents/ColorInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { changeAxisKey, updateAxis } from "../../state/aces/acesSlice";
import { isVertical } from "../../utils/axis";
import { resizeH, resizeW } from "../../state/chart/chartSlice";
import { Selection } from "../../state/selected/selectedSlice"
import { CheckInput } from "../../formComponents/CheckInput";
import { Dataset } from "../../state/dto";
import { TextInput } from "../../formComponents/TextInput";
import { Brackets, Eye, FlipHorizontal2, Menu, RotateCcw, Tag, Type } from "lucide-react";
import { SelectInput } from "../../formComponents/SelectInput";
import { HR } from "../../ui-elements/HR";
import { Section } from "../../ui-elements/form/Section";
import { Label } from "../../ui-elements/Label";
import { inputIconProps } from "../../formComponents/styleConst";


interface IAxisPanel {
    dataset: Dataset | undefined;
}

export const AxisPanel = (props: IAxisPanel) => {

    const dispatch = useDispatch()
    const axis: LinearAxis = useSelector((state: RootState) => state.aces.find(ax => ax.id === (state.selection.selection as Selection).key)) as LinearAxis
    const chart = useSelector((state: RootState) => state.chart)

    const _updateAxis = (newAxis: LinearAxis) => {
        dispatch(updateAxis(newAxis))
    }

    const changeSize = (newSize: number) => {
        let newScale: Scale = {
            ...axis.scale,
            props: {
                ...axis.scale.props,
                range: [0, newSize]
            }
            // range: [0, newSize]
        }
        _updateAxis({ ...axis, scale: newScale })
        if (isVertical(axis)) {
            resizeH(newSize)
        }
        else {
            resizeW(newSize)
        }
    }

    const updateDomain = (newDomain: number[]) => {
        let newScale: Scale = {
            ...axis.scale,
            props: {
                ...axis.scale.props,
                domain: newDomain
            }
        }
        _updateAxis({
            ...axis,
            scale: newScale
        })
    }

    const updateStyle = (newStyle: AxisStyle) => {
        _updateAxis({
            ...axis,
            style: {
                ...newStyle
            }
        })
    }

    return <div className="text-left flex flex-col gap-y-4">

        <span></span>

        <Section label="Property">
            <SelectInput
                label={<Tag {...inputIconProps} />}
                options={props.dataset?.props.map(p => p.key).map(p => ({ value: p, label: p }))}
                value={axis.key}
                onChange={(val) => dispatch(changeAxisKey({ axis: axis, dataset: props.dataset, newKey: val }))}
            />
        </Section>

        <HR />

        {axis.scale.type === "linear" && <>
            <Section label="Domain">
                <NumberInput
                    label={<Brackets {...inputIconProps} />}
                    value={axis.scale.props.domain[0] as number}
                    onChange={(val) => updateDomain([(val as number), axis.scale.props.domain[1] as number])}
                />
                <NumberInput
                    label={<Brackets {...inputIconProps} />}
                    value={axis.scale.props.domain[1] as number}
                    onChange={(val) => updateDomain([axis.scale.props.domain[0] as number, (val as number)])}
                />
            </Section>
        </>}

        {axis.scale.type === "band" && <>
            <Label>Domain values</Label>
            <div className="flex flex-wrap">
                {axis.scale.props.domain.map(v =>
                    <p className="mx-[2px] my-[2px] p-[1px] text-xs cursor-default border" key={v}>{v}</p>
                )}
            </div>
        </>}

        {axis.position !== AxisPosition.CIRCULAR && <>

            <HR />

            <Section label="Layout">
                <NumberInput
                    label={<span className="text-xs">M</span>}
                    value={axis.margin}
                    onChange={(val) => _updateAxis({ ...axis, margin: (val as number) })}
                />
                <NumberInput
                    label={<span className="text-xs">W</span>}
                    value={isVertical(axis) ? chart.rect.h : chart.rect.w}
                    onChange={(val) => changeSize(val)}
                />
                <CheckInput
                    label={<FlipHorizontal2 {...inputIconProps} />}
                    value={axis.invert}
                    onChange={(val) => _updateAxis({ ...axis, invert: val })}
                />
            </Section>

            <HR />

            <Section label="Label">
                <TextInput
                    label={<Type  {...inputIconProps} />}
                    value={axis.label ?? axis.key}
                    onChange={v => _updateAxis({ ...axis, label: v })}
                />
                {/* <AlignInput /> */}
            </Section>

            <HR />

            <Section label="Line">
                <NumberInput
                    minValue={0}
                    label={<Menu  {...inputIconProps} />}
                    value={axis.style.lineThickness}
                    onChange={(v) => updateStyle({ ...axis.style, lineThickness: v })}
                />
                <CheckInput
                    label={<Eye {...inputIconProps} />}
                    value={axis.style.lineVisible}
                    onChange={v => updateStyle({ ...axis.style, lineVisible: v })}
                />
                <ColorInput
                    value={axis.style.lineColor}
                    onChange={(v) => updateStyle({ ...axis.style, lineColor: v })}
                />
            </Section>

            <HR />

            <Section label="Ticks">
                <NumberInput
                    minValue={0}
                    label={<Menu  {...inputIconProps} />}
                    value={axis.style.tickThickness}
                    onChange={(val) => updateStyle({ ...axis.style, tickThickness: val })}
                />
                <CheckInput
                    label={<Eye {...inputIconProps} />}
                    value={axis.style.tickVisible}
                    onChange={v => updateStyle({ ...axis.style, tickVisible: v })}
                />
                <ColorInput
                    value={axis.style.tickColor}
                    onChange={(val) => updateStyle({ ...axis.style, tickColor: val })}
                />
            </Section>
            <HR />

            <Section label="Text">
                <NumberInput
                    minValue={0}
                    label={<Menu  {...inputIconProps} />}
                    value={axis.style.fontSize}
                    onChange={(val) => updateStyle({ ...axis.style, fontSize: val })}
                />
                <CheckInput
                    label={<Eye {...inputIconProps} />}
                    value={axis.style.tickTextVisible}
                    onChange={v => updateStyle({ ...axis.style, tickTextVisible: v })}
                />
                <ColorInput
                    value={axis.style.fontColor}
                    onChange={(val) => updateStyle({ ...axis.style, fontColor: val })}
                />
                <SelectInput 
                    label={<RotateCcw {...inputIconProps}/>}
                    options={[{label: "0°", value: "0"},{label: "15°", value: "-15"}, {label: "30°", value: "-30"}, {label: "45°", value: "-45"}, {label: "60°", value: "-60"},{label: "75°", value: "-75"},{label: "90°", value: "-90"}]} 
                    value={axis.style.textAngle.toString()} 
                    onChange={val => updateStyle({ ...axis.style, textAngle: +val })}
                    short
                >
                    
                </SelectInput>
            </Section>
        </>}

    </div>
}