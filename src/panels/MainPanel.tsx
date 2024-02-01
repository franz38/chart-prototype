import { Button, Divider, Drawer, Flex, Typography, Upload, UploadFile } from "antd"
import { LevelsPanel } from "./LevelsPanel"
import { useState } from "react"
import { Dataset } from "../state/dto"
import { Database, Layers, Paperclip, UploadIcon } from "lucide-react"
import { loadLocalDs, onFileUpload } from "../utils/data"
import { UploadChangeParam } from "antd/es/upload"
import { sectionHeader } from "./interfaceUtils"
const { Text } = Typography;


const iconAttributes = {
    size: 14,
    color: "rgba(0, 0, 0, 0.88)",
}

const buttonStyle: React.CSSProperties = {
    width: "100%",
    textAlign: "start",
    borderRadius: 0,
    height: "2.5rem"
}

export const MainPanel = (props: {
    dataset: Dataset | undefined
    datasetSelect: () => void;
    setDataset: (ds: Dataset) => void;
    visible: boolean;
}) => {

    const [sectionSelected, setSectionSelected] = useState<"items" | "data">("items")

    const _loadLocalDs = async () => {
        try {
            const ds = await loadLocalDs("./world_cups.csv")
            props.setDataset(ds)
        }
        catch (error) {
            throw new Error("Error reading the csv file")
        }
    }

    const onFileInputChange = async (info: UploadChangeParam<UploadFile<any>>) => {
        const ds = await onFileUpload(info.file.originFileObj)
        if (ds) props.setDataset(ds)
    }

    return <Drawer
        placement="left"
        open={props.visible}
        styles={{ body: { padding: '0px' } }}
        mask={false}
        closable={false}
        width={240}
    >
        <Flex justify="space-evenly" style={{ padding: "1rem .5rem 0rem .5rem" }}>
            <Button
                type="text"
                onClick={() => setSectionSelected("items")}
                icon={<Layers {...iconAttributes} />}
                className={sectionSelected == "items" ? "mainButton" : ""}
            >Items</Button>
            <Button
                type="text"
                onClick={() => setSectionSelected("data")}
                icon={<Database {...iconAttributes} />}
                className={sectionSelected == "data" ? "mainButton" : ""}
            >Data</Button>
        </Flex>
        <Divider style={{ margin: "1rem 0px" }} />
        {sectionSelected == "items" && <LevelsPanel />}
        {sectionSelected == "data" && <Flex vertical style={{ padding: "1rem .5rem" }} gap={10}>
            <Text {...sectionHeader}>Datasets</Text>
            {props.dataset && <Flex >
                <Button
                    type="text"
                    icon={<Paperclip {...iconAttributes} />}
                    style={{ ...buttonStyle }}
                    onClick={() => props.datasetSelect()}
                >{props.dataset.file.name}</Button>
            </Flex>}

            <Divider />

            <Button
                style={{ ...buttonStyle }}
                onClick={() => _loadLocalDs()}
            >Generate ds</Button>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={onFileInputChange}
                style={{ width: "100%" }}
            >
                <Flex justify="center" align="center">
                    <UploadIcon />
                    <button style={{ border: 0, background: 'none', paddingTop: ".2rem" }} type="button">
                        <div style={{ marginTop: 8 }}>Upload dataset</div>
                    </button>
                </Flex>
            </Upload>
            {/* <input type="button" value={"load ds"} onClick={() => loadLocalDs()}></input> */}
        </Flex>}
    </Drawer>
}