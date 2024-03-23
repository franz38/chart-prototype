import { ColorPicker } from "antd";
import { getOpacity } from "../utils/colors";

interface ColorInputProps {
  value: string;
  onChange: (v: string) => void;
  // short?: boolean;
  size?: "short" | "mini";
}

export const ColorInput = (props: ColorInputProps) => {
  let width = "204px";
  if (props.size) {
    if (props.size === "short") width = "auto";
    else if (props.size === "mini") width = "30px";
  }
  return (
    <>
      <label
        className="flex w-full"
        style={{
          display: "flex",
          width: width,
          borderRadius: "2px",
          border: props.size !== "mini" ? "1px solid #eee" : "none",
        }}
      >
        <div className="flex w-full items-center h-[30px]">
          <ColorPicker
            value={props.value ?? "#000"}
            onChange={(val) => props.onChange(val.toHexString())}
            size="small"
            style={{ marginLeft: "4px" }}
          />
          {(!props.size || props.size !== "mini") && (
            <input
              type="text"
              style={{
                border: "0px",
                outline: "none",
                minWidth: "0px",
                width: "max-content",
                paddingLeft: "8px",
                fontSize: "12px",
                height: "30px",
              }}
              value={props.value}
              onChange={(v) => props.onChange(v.target.value)}
            ></input>
          )}
          {!props.size && (
            <input
              className="text-center"
              type="text"
              style={{
                border: "0px",
                outline: "none",
                minWidth: "0px",
                fontSize: "12px",
                height: "30px",
                width: "50px",
              }}
              value={getOpacity(props.value)}
              disabled
            ></input>
          )}
        </div>
      </label>
    </>
  );
};
