
const labelStyle: React.CSSProperties = {
    display: "block",
    lineHeight: "30px",
    width: "30px",
    textAlign: "center",
    fontSize: "12px",
    userSelect: "none",
}

interface CheckInputProps {
    label?: string | React.ReactNode;
    value: boolean;
    onChange: (v: boolean) => void;
}

export const CheckInput = (props: CheckInputProps) => {

    return <label
        style={{ display: "flex", width: "96px", borderRadius: "2px", border: "1px solid #eee" }}
    >
        {props.label && <span
            style={labelStyle}
        >{props.label}</span>}
        <input type="checkbox" checked={props.value} onChange={() => props.onChange(!props.value)}></input>
    </label>
}