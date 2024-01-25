import { ColorPicker, Flex } from "antd";
import { parseToRgba } from 'color2k';

interface ColorInputProps {
    value: string;
    onChange: (v: string) => void;
}

export const ColorInput = (props: ColorInputProps) => {

    return <>
        <label style={{ display: "flex", width: "204px", borderRadius: "2px", border: "1px solid #eee" }}>
            <Flex align="center" justify="space-between" style={{ width: "100%" }}>
                <ColorPicker
                    value={props.value ?? "#000"}
                    onChange={(val) => props.onChange(val.toHexString())}
                    size="small"
                    style={{ marginLeft: "4px" }}
                />
                <input
                    type="text"
                    style={{ border: "0px", outline: "none", minWidth: "0px", width: "max-content", paddingLeft: "8px", fontSize: "12px", height: "30px" }}
                    value={props.value}
                    onChange={(v) => props.onChange(v.target.value)}
                ></input>
                <input
                    type="text"
                    style={{ border: "0px", outline: "none", minWidth: "0px", fontSize: "12px", height: "30px", width: "50px" }}
                    value={`${Math.ceil(parseToRgba(props.value)[3] * 100)}%`}
                    disabled
                ></input>
            </Flex>
        </label>
    </>
}