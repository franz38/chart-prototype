import { Brackets, ChevronDown, ChevronUp, Menu, Move3D, Ruler } from 'lucide-react';
import { NumberInput } from '../../formComponents/NumberInput';
import { inputIconProps } from '../../formComponents/styleConst';
import { Section } from '../../ui-elements/form/Section';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Plot, SpiderPlot } from '../../state/plots/dto';
import { Selection } from "../../state/selected/selectedSlice"
import { updatePlot } from '../../state/plots/plotsSlice';
import { Dataset, PlotType } from '../../state/dto';
import { ColorInput } from '../../formComponents/ColorInput';
import { SelectInput } from '../../formComponents/SelectInput';
import { HR } from '../../ui-elements/HR';
import { NumericScale } from '../../state/aces/dto';
import { useState } from 'react';

interface SpiderPlotPanelProps {
    dataset: Dataset | undefined;
    changePlotType: (plot: Plot, newType: PlotType) => void;
}

export const SpiderPlotPanel = (props: SpiderPlotPanelProps) => {

    const dispatch = useDispatch()
    const plot = useSelector((state: RootState) => state.plots.find(plt => plt.name === (state.selection.selection as Selection).key)) as SpiderPlot
    const [axisExpanded, setAxisExpanded] = useState<string>();

    const editPlot = (plt: SpiderPlot) => {
        dispatch(updatePlot(plt))
    }

    return (
        <div className="text-left flex flex-col gap-y-4">
            <span></span>

            <Section label="Layout">
                <NumberInput
                    minValue={0}
                    label={<Ruler  {...inputIconProps} />}
                    value={plot.axisLenght}
                    onChange={(val) => editPlot({ ...plot, axisLenght: val })}
                />
            </Section>

            <HR />

            <Section label="Area colors">
                {plot.colors.map(c => <ColorInput
                    key={c}
                    size='mini'
                    value={c}
                    onChange={(val) => editPlot({ ...plot, areaColor: val })}
                />)}
                {/* <DynamicColor 
                    value={undefined} 
                    dataset={props.dataset} 
                    onChange={function (v: DynamicContinuous<number, string> | DynamicContinuous<string, string>): void {
                    throw new Error('Function not implemented.');
                    } }                    
                /> */}
            </Section>

            <Section label="Area border color">
                <ColorInput
                    size='short'
                    value={plot.areaStrokeColor}
                    onChange={(val) => editPlot({ ...plot, areaStrokeColor: val })}
                />
            </Section>

            <HR />

            <Section label="Aces">
                <div className="w-[204px] flex flex-col gap-y-1">
                    {(props.dataset?.props ?? []).filter(v => v.type === "continous").map((propName, _id) => <div className='flex flex-col w-full border border-[#eee] ' key={propName.key}>

                        <div className={'flex flex-row gap-1 items-center ' + (Object.keys(plot.aces).includes(propName.key) ? "opacity-100" : "opacity-50")}>
                            {axisExpanded === propName.key ?
                                <ChevronUp size={14} color='rgba(0, 0, 0, 0.88)' className='w-[30px] h-[30px] p-2 cursor-pointer'
                                    onClick={() => { if (propName.key === axisExpanded) { setAxisExpanded(undefined) } else { setAxisExpanded(propName.key) } }}
                                /> :
                                <ChevronDown size={14} color='rgba(0, 0, 0, 0.88)' className='w-[30px] h-[30px] p-2 cursor-pointer'
                                    onClick={() => { if (propName.key === axisExpanded) { setAxisExpanded(undefined) } else { setAxisExpanded(propName.key) } }}
                                />}
                            <span
                                className="min-w-14 inline-block rounded-sm  text-xs p-[2px] leading-[26px] h-[30px] truncate cursor-default grow"
                                title={propName.key}
                            >{propName.key}</span>
                            <input
                                className='w-[30px]'
                                type='checkbox'
                                checked={Object.keys(plot.aces).includes(propName.key)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        editPlot({ ...plot, aces: { ...plot.aces, [propName.key]: { domain: propName.extent, range: [0, plot.axisLenght] } } })
                                    } else {
                                        editPlot({ ...plot, aces: Object.keys(plot.aces).filter(k => k !== propName.key).reduce((acc, cur) => { acc[cur] = plot.aces[cur]; return acc }, {} as { [id: string]: NumericScale }) })
                                    }
                                }}
                            />
                        </div>

                        {<div className={`flex transition duration-150 ease-in-out ${axisExpanded && axisExpanded === propName.key ? "" : "hidden"}`}>
                            <NumberInput
                                minValue={0}
                                label={<Brackets  {...inputIconProps} />}
                                value={plot.aces[propName.key]?.domain[0]}
                                onChange={(val) => editPlot({ ...plot, aces: { ...plot.aces, [propName.key]: { ...plot.aces[propName.key], domain: [val, plot.aces[propName.key].domain[1]] } } })}
                            />
                            <NumberInput
                                minValue={0}
                                label={<Brackets  {...inputIconProps} />}
                                value={plot.aces[propName.key]?.domain[1]}
                                onChange={(val) => editPlot({ ...plot, aces: { ...plot.aces, [propName.key]: { ...plot.aces[propName.key], domain: [plot.aces[propName.key].domain[0], val] } } })}
                            />
                        </div>}

                    </div>)}
                </div>
            </Section>

            <HR />

            <Section label="Aces lines">
                <ColorInput
                    size='short'
                    value={plot.acesLinesColor}
                    onChange={(val) => editPlot({ ...plot, acesLinesColor: val })}
                />
                <NumberInput
                    minValue={1}
                    label={<Menu  {...inputIconProps} />}
                    value={plot.acesLinesThickness}
                    onChange={(val) => editPlot({ ...plot, acesLinesThickness: val })}
                />
            </Section>

            <HR />

            <Section label="Aces labels">
                <NumberInput
                    minValue={0}
                    maxValue={100}
                    label={<Ruler  {...inputIconProps} />}
                    value={plot.axisLabelDistance}
                    onChange={(val) => editPlot({ ...plot, axisLabelDistance: val })}
                />
                <NumberInput
                    minValue={0}
                    label={<Menu  {...inputIconProps} />}
                    value={plot.axisLabelSize}
                    onChange={(val) => editPlot({ ...plot, axisLabelSize: val })}
                />
                <ColorInput
                    value={plot.axisLabelColor}
                    onChange={(val) => editPlot({ ...plot, axisLabelColor: val })}
                />
            </Section>

            <HR />

            <Section label="Inner lines">
                <SelectInput
                    label={<Move3D {...inputIconProps} />}
                    value={plot.innerLinesStyle}
                    options={[{ value: "straight", label: "straight" }, { value: "curve", label: "curve" }]}
                    onChange={(val) => editPlot({ ...plot, innerLinesStyle: val as "straight" | "curve" })}
                />
                <NumberInput
                    minValue={1}
                    label={<Menu  {...inputIconProps} />}
                    value={plot.innerLines}
                    onChange={(val) => editPlot({ ...plot, innerLines: val })}
                />
                <ColorInput
                    size='short'
                    value={plot.innerLinesColor}
                    onChange={(val) => editPlot({ ...plot, innerLinesColor: val })}
                />
                <ColorInput
                    size='short'
                    value={plot.innerLinesStrokeColor}
                    onChange={(val) => editPlot({ ...plot, innerLinesStrokeColor: val })}
                />
            </Section>

        </div>
    );
};