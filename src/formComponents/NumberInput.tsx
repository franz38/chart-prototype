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

export const NumberInput = (props: NumberInputProps) => {
  const [startDragPos, setStartDragPos] = useState<number | undefined>();
  const [tempValue, setTempValue] = useState<number | undefined>();

  const onChange = (v: number) => {
    if (
      (props.minValue == undefined || v >= props.minValue) &&
      (props.maxValue == undefined || v <= props.maxValue)
    ) {
      props.onChange(v);
      console.log(v);
    }
  };

  return (
    <>
      <label
        title={props.title}
        className="flex h-[30px] w-[96px] items-center rounded-sm border border-[#eee]"
        onMouseMove={(e) => {
          if (startDragPos) {
            setTempValue((tempValue ?? props.value) + e.movementX);
            onChange(tempValue ?? props.value);
          }
        }}
        onMouseUp={() => {
          if (startDragPos) {
            setStartDragPos(undefined);
            onChange(tempValue ?? props.value);
            setTempValue(undefined);
          }
        }}
        onMouseLeave={() => {
          if (startDragPos) {
            setStartDragPos(undefined);
            onChange(tempValue ?? props.value);
            setTempValue(undefined);
          }
        }}
      >
        {props.label && (
          <span
            className="flex justify-center items-center w-[30px] h-[30px] cursor-ew-resize"
            onMouseDown={(e) => {
              setStartDragPos(e.clientX);
            }}
          >
            {props.label}
          </span>
        )}
        <input
          type="number"
          style={{
            border: "0px",
            outline: "none",
            minWidth: "0px",
            width: "calc(100% - 30px)",
            fontSize: "12px",
            height: "28px",
          }}
          value={tempValue ?? props.value}
          onChange={(v) => onChange(parseInt(v.target.value))}
          min={props.minValue}
          max={props.maxValue}
        ></input>
      </label>
    </>
  );
};
