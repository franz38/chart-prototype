import { Label } from "../Label";

export const Section = (props: any) =>
    <div className="gap-y-3">
        {props.label && <Label>{props.label}</Label>}
        <div className="flex flex-wrap gap-2 pt-2">{props.children}</div>
    </div>