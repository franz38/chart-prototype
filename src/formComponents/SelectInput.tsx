
interface SelectInputProps {
    label?: string | React.ReactNode;
    options: { value: string, label: string }[] | undefined;
    value: string | undefined;
    onChange: (key: string) => void;
    readonly?: boolean;
}

const labelStyle: React.CSSProperties = {
    display: "block",
    lineHeight: "30px",
    width: "30px",
    textAlign: "center",
    fontSize: "12px",
    userSelect: "none",
}

export const SelectInput = (props: SelectInputProps) => {


    return <>
        <label style={{ display: "flex", width: "204px", borderRadius: "2px", border: "1px solid #eee", height: "30px", lineHeight: "30px" }}>
            <div style={{ display: "flex", width: "-webkit-fill-available" }}>
                <span style={labelStyle}>{props.label}</span>
                <select
                    disabled={props.readonly}
                    style={{ flexGrow: 1 }}
                    value={props.value}
                    onChange={(e) =>
                        props.onChange((props.options ?? []).find(opt => opt.value === e.target.value)?.value as string)
                    }
                >
                    {(props.options ?? []).map(option =>
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    )}
                </select>
            </div>
        </label>
    </>
}