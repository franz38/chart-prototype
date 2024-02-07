interface SectionContainerProps {
    children: JSX.Element | JSX.Element[];
    className?: string;
}

export const SectionContainer = (props: SectionContainerProps) => <div className={`text-left flex flex-col gap-y-4 ${props.className ?? ""}`}><span></span>{props.children}</div>