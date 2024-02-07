import { ColorPicker } from "antd";
import { getOpacity } from "../utils/colors";

interface ColorInputProps {
    value: string;
    onChange: (v: string) => void;
    short?: boolean;
}

export const ColorInput = (props: ColorInputProps) => {

    return <>
        <label style={{ display: "flex", width: !props.short ? "204px" : "auto", borderRadius: "2px", border: "1px solid #eee" }}>
            <div className="flex w-full items-center">
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
                {!props.short && <input
                    className="text-center"
                    type="text"
                    style={{ border: "0px", outline: "none", minWidth: "0px", fontSize: "12px", height: "30px", width: "50px" }}
                    value={getOpacity(props.value)}
                    disabled
                ></input>}
            </div>
        </label>
    </>
}