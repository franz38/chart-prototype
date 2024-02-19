import React from "react";

interface TextInputProps {
    label?: string | React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    title?: string;
}

export const TextInput = (props: TextInputProps) => {

    return <>
        <label
            title={props.title}
            className="w-full flex items-center rounded-sm border border-[#eee]"
        >
            {props.label && <span
                className="flex justify-center items-center w-[30px] h-[30px]"
            >{props.label}</span>}
            <input
                type="text"
                style={{ border: "0px", outline: "none", minWidth: "0px", width: "calc(100% - 30px)", fontSize: "12px", height: "30px" }}
                value={props.value}
                onChange={(v) => props.onChange(v.target.value)}
            ></input>
        </label>
    </>
}