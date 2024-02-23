interface CheckInputProps {
  label?: string | React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}

export const CheckInput = (props: CheckInputProps) => {
  return (
    <label className="flex h-[30px] w-[96px] items-center rounded-sm border border-[#eee] cursor-pointer">
      {props.label && (
        <span className="flex justify-center items-center w-[30px] h-[30px]">
          {props.label}
        </span>
      )}
      <input
        type="checkbox"
        checked={props.value}
        onChange={() => props.onChange(!props.value)}
      ></input>
    </label>
  );
};
