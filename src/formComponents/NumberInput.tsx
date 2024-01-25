import React, { useState } from "react";

interface NumberInputProps {
    label?: string | React.ReactNode;
    title?: string;
    value: number;
    onChange: (v: number) => void;
    onDragging?: (v: number) => void;
    minValue?: number;
    maxValue?: number;
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

export const NumberInput = (props: NumberInputProps) => {

    const [startDragPos, setStartDragPos] = useState<number | undefined>()
    const [tempValue, setTempValue] = useState<number | undefined>()

    const onChange = (v: number) => {
        if (
            (props.minValue == undefined || v >= props.minValue) &&
            (props.maxValue == undefined || v <= props.maxValue)
        ) props.onChange(v)
    }

    return <>
        <label
            title={props.title}
            style={{ display: "flex", width: "96px", borderRadius: "2px", border: "1px solid #eee", height: "30px" }}
            onMouseMove={(e) => {
                if (startDragPos) {
                    setTempValue((tempValue ?? props.value) + e.movementX);
                    onChange(tempValue ?? props.value)
                }
            }}
            onMouseUp={() => { setStartDragPos(undefined); onChange(tempValue ?? props.value); setTempValue(undefined) }}
            onMouseLeave={() => { setStartDragPos(undefined); onChange(tempValue ?? props.value); setTempValue(undefined) }}
        >
            {props.label && <span style={labelStyle}
                onMouseDown={(e) => { setStartDragPos(e.clientX) }}
            >{props.label}</span>}
            <input
                type="number"
                style={{ border: "0px", outline: "none", minWidth: "0px", width: "calc(100% - 30px)", fontSize: "12px", height: "28px" }}
                value={tempValue ?? props.value}
                onChange={(v) => onChange(parseInt(v.target.value))}
                min={props.minValue}
                max={props.maxValue}
            ></input>
        </label>
    </>
}