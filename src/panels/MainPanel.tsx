import { Button, Divider, Drawer, Flex, Upload } from "antd"
import { LevelsPanel } from "./LevelsPanel"
import { useState } from "react"
import { Dataset } from "../state/dto"
import { Database, Layers, Paperclip } from "lucide-react"
import { loadLocalDs, onFileUpload } from "../utils/data"


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
}) => {

    const [sectionSelected, setSectionSelected] = useState<"items" | "data">("items")

    const _loadLocalDs = async () => {
        try {
            const ds = await loadLocalDs("./package.csv")
            props.setDataset(ds)
        }
        catch (error) {
            throw new Error("Error reading the csv file")
        }
    }

    const _onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            try {
                let file: File = e.target.files[0]
                const ds = await onFileUpload(file)
                if (ds)
                    props.setDataset(ds)

            } catch (error) {
                throw new Error("Error reading the csv file")
            }
        }
    };

    return <Drawer
        placement="left"
        open={!!true}
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
            >Items</Button>
            <Button
                type="text"
                onClick={() => setSectionSelected("data")}
                icon={<Database {...iconAttributes} />}
            >Data</Button>
        </Flex>
        <Divider style={{ margin: "1rem 0px" }} />
        {sectionSelected == "items" && <LevelsPanel />}
        {sectionSelected == "data" && <Flex vertical style={{ padding: "1rem .5rem" }}>
            {props.dataset && <Flex >
                <Button
                    type="text"
                    icon={<Paperclip {...iconAttributes} />}
                    style={{ ...buttonStyle }}
                    onClick={() => props.datasetSelect()}
                >{props.dataset.file.name}</Button>
            </Flex>}

            <Flex vertical style={{ paddingTop: "1.5rem" }}>
                <Button
                    style={{ ...buttonStyle }}
                    onClick={() => _loadLocalDs()}
                >Generate ds</Button>
                <input
                    type="file"
                    accept=".csv"
                    onChange={_onFileUpload}
                ></input>
                <Upload
                    onChange={(info) => console.log(info)}
                >
                    <Button icon={<></>}>Click to Upload</Button>
                </Upload>
            </Flex>
            {/* <input type="button" value={"load ds"} onClick={() => loadLocalDs()}></input> */}
        </Flex>}
    </Drawer>
}