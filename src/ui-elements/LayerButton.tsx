interface LayerButtonProps {
    onClick?: () => void;
    className?: string;
    selected?: boolean;
    minified: boolean;
    icon: JSX.Element;
    label: string;
    padding: number;
}

const baseclass = "w-full flex flex-row pr-2 py-2 h-[40px] items-center hover:bg-[#eee] cursor-pointer rounded-sm text-sm transition-all duration-300" as const

export const LayerButton = (props: LayerButtonProps) => {

    let pl = "pl-2"
    if (!props.minified)
        pl = `pl-${(props.padding > 0 ? props.padding : 0.5)*8}`

    return <div
    className={`${baseclass} ${props.selected ? "bg-[#eee] " : ""} ${props.minified ? "justify-center" : "justify-between"} 
    ${pl}`}
    onClick={() => { if (props.onClick) props.onClick() }}
    title={props.label}
>
    <div className="flex items-center">
        {props.icon}
        {!props.minified && <span className="ms-2">{props.label}</span>}
    </div>
</div>
}