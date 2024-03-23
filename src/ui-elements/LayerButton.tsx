interface LayerButtonProps {
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  minified: boolean;
  icon: JSX.Element;
  label: string;
  padding: number;
}

const baseclass =
  "w-full flex flex-row pr-2 py-2 h-[40px] items-center hover:bg-[#eee] cursor-pointer rounded-sm text-sm transition-all duration-300" as const;

export const LayerButton = (props: LayerButtonProps) => {
  const getPlt = (minified: boolean, padding: number): string => {
    if (!minified) {
      if (padding == 3) return "pl-16";
      if (padding == 2) return "pl-12";
      if (padding > 0) return "pl-8";
      else return "pl-4";
    }
    return "pl-2";
  };

  return (
    <div
      className={`${baseclass} ${getPlt(props.minified, props.padding)} ${props.selected ? "bg-[#eee] " : ""} ${props.minified ? "justify-center" : "justify-between"}`}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
      title={props.label}
    >
      <div className="flex items-center">
        {props.icon}
        {!props.minified && <span className="ms-2">{props.label}</span>}
      </div>
    </div>
  );
};
