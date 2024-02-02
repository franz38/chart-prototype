import { Flex } from "antd";
import { DynamicContinuous } from "../state/plots/dto"
import { ColorGradient } from "./ColorGradient";
import { ColorInput } from "./ColorInput";
import { SelectInput } from "./SelectInput";
import { Dataset } from "../state/dto";
import { inputIconProps } from "./styleConst";
import { getRange } from "../utils/data";
import { Tag } from "lucide-react";
import { randomColor } from "../utils/colors";

interface DynamicColorProps {
    value: DynamicContinuous<number, string> | DynamicContinuous<string, string>;
    dataset: Dataset | undefined;
    onChange: (v: DynamicContinuous<number, string> | DynamicContinuous<string, string>) => void
}

export const DynamicColor = (props: DynamicColorProps) => {

    const onKeyChange = (val: string) => {
        if (val !== "fixed") {
            const newDomain = getRange(props.dataset, val) ?? []
            let range = [...props.value.range ?? []]
            newDomain.forEach((_, i) => {
                if (i >= range.length) range.push(randomColor())
            })
            props.onChange({
                ...props.value,
                key: val,
                domain: newDomain as number[],
                range: range
            })
        }
        else
            props.onChange({ ...props.value, key: undefined })

    }

    return <>
        <SelectInput
            label={<Tag {...inputIconProps} />}
            options={[{ value: "fixed", label: "fixed" }, ...props.dataset?.props.map(p => ({ value: p, label: p })) ?? []]}
            value={props.value.key ? props.value.key : "fixed"}
            onChange={(val) => onKeyChange(val)}
        />
        {!props.value.key &&
            <ColorInput
                value={props.value.fixedValue}
                onChange={(val) => props.onChange({ ...props.value, fixedValue: val })}
            />
        }
        {(props.value.key && props.value.domain && props.value.range) && <>
            {typeof props.value.domain[0] === "number" &&
                <ColorGradient
                    value1={(props.value.range as string[])[0]}
                    value2={(props.value.range as string[])[1]}
                    onChange={function (c1: string, c2: string): void { props.onChange({ ...props.value, range: [c1, c2] }) }}
                />
            }
            {typeof props.value.domain[0] === "string" &&
                <Flex vertical style={{ width: "100%" }} gap={6}>
                    {props.value.domain.map((el, id) => <Flex justify="space-between" align="center" key={el}>
                        <span className="uiStyle">{el}</span>
                        <ColorInput
                            value={(props.value.range as string[])[id] ?? "yellow"}
                            onChange={(val) => {
                                const rangeCopy = [...props.value.range as string[]]
                                rangeCopy[id] = val
                                props.onChange({ ...props.value, range: rangeCopy })
                            }}
                            short
                        />
                    </Flex>)}
                </Flex>
            }
        </>}
    </>
}