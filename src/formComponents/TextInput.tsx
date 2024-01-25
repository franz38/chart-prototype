import { Flex } from "antd";
import React from "react";

interface TextInputProps {
    label?: string | React.ReactNode;
    value: string;
    onChange: (v: string) => void;
}

const labelStyle: React.CSSProperties = {
    display: "block",
    lineHeight: "30px",
    width: "30px",
    textAlign: "center",
    fontSize: "12px",
    userSelect: "none",
    cursor: "ew-resize"
}

export const TextInput = (props: TextInputProps) => {

    return <>
        <label
            style={{ display: "flex", width: "204px", borderRadius: "2px", border: "1px solid #eee" }}
        >
            <Flex align="center">
                {props.label && <span
                    style={labelStyle}
                >{props.label}</span>}
                <input
                    type="text"
                    style={{ border: "0px", outline: "none", minWidth: "0px", width: "calc(100% - 30px)", fontSize: "12px", height: "30px" }}
                    value={props.value}
                    onChange={(v) => props.onChange(v.target.value)}
                ></input>
            </Flex>
        </label>
    </>
}