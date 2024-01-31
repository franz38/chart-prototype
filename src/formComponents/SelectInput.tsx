
interface SelectInputProps<T> {
    label?: string | React.ReactNode;
    options: { value: T, label: string }[] | undefined;
    value: T | undefined;
    onChange: (key: T) => void;
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

export const SelectInput = <T,>(props: SelectInputProps<T>) => {


    return <>
        <label className="selectInput">
            <div>
                <span style={labelStyle}>{props.label}</span>
                <select
                    disabled={props.readonly}
                    style={{ flexGrow: 1 }}
                    value={props.value as string}
                    onChange={(e) =>
                        props.onChange((props.options ?? []).find(opt => opt.value === e.target.value)?.value as T)
                    }
                >
                    {(props.options ?? []).map(option =>
                        <option key={option.value as string} value={option.value as string}>
                            {option.label}
                        </option>
                    )}
                </select>
            </div>
        </label>
    </>
}