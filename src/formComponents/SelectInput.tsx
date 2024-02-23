interface SelectInputProps<T> {
  label?: string | React.ReactNode;
  options: { value: T; label: string }[] | undefined;
  value: T | undefined;
  onChange: (key: T) => void;
  readonly?: boolean;
  short?: boolean;
}

export const SelectInput = <T,>(props: SelectInputProps<T>) => {
  return (
    <>
      <label
        className={`flex flex-row text-[13px] ${props.short ? "min-w-[94px]" : "min-w-[204px]"} h-[32px] border border-[#eee] `}
      >
        <span className="flex justify-center items-center w-[30px] h-[30px]">
          {props.label}
        </span>
        <select
          disabled={props.readonly}
          style={{ flexGrow: 1 }}
          value={props.value as string}
          onChange={(e) =>
            props.onChange(
              (props.options ?? []).find((opt) => opt.value === e.target.value)
                ?.value as T,
            )
          }
        >
          {(props.options ?? []).map((option) => (
            <option key={option.value as string} value={option.value as string}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
};
