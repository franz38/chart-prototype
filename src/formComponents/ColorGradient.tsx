import { ColorPicker, Flex } from "antd";

interface ColorInputProps {
    value1: string;
    value2: string;
    onChange: (c1: string, c2: string) => void;
}

export const ColorGradient = (props: ColorInputProps) => {

    return <>
        <Flex vertical style={{ width: "100%", border: "1px solid #eee" }}>
            <Flex align="center" justify="space-between" style={{ width: "100%", marginTop: "4px" }}>
                <ColorPicker
                    value={props.value1 ?? "#000"}
                    // onChange={(val) => props.onChange(val.toHexString())}
                    size="small"
                    style={{ marginLeft: "4px" }}
                />
                <ColorPicker
                    value={props.value2 ?? "#000"}
                    // onChange={(val) => props.onChange(val.toHexString())}
                    size="small"
                    style={{ marginRight: "4px" }}
                />
            </Flex>
            <div style={{
                background: `linear-gradient(90deg, ${props.value1} 0%, ${props.value2} 100%)`,
                width: "-webkit-fill-available",
                height: "24px",
                margin: "12px 4px 4px 4px",
            }}></div>
        </Flex>
    </>
}