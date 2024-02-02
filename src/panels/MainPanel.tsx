import { Button, Flex, Upload, UploadFile } from "antd"
import { LevelsPanel } from "./LevelsPanel"
import { useState } from "react"
import { Dataset } from "../state/dto"
import { Paperclip, UploadIcon } from "lucide-react"
import { loadLocalDs, onFileUpload } from "../utils/data"
import { UploadChangeParam } from "antd/es/upload"
import { Section } from "../ui-elements/form/Section"
import { SectionContainer } from "../ui-elements/form/SectionContainer"
import { HR } from "../ui-elements/HR"


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

    return <>
        <div id="default-sidebar" className={`fixed top-12 left-0 z-40 w-60 h-screen transition-transform ${props.visible ? "" : "-translate-x-60"} bg-white shadow-2xl`} aria-label="Sidebar">
            <div className="flex-col p-2">
                <div className="flex flex-row justify-evenly pb-4 pt-2 border-b">
                    <span
                        onClick={() => setSectionSelected("items")}
                        className={`text-sm font-medium cursor-pointer ${sectionSelected === "items" ? "underline" : ""}`}
                    >Items</span>
                    <span
                        onClick={() => setSectionSelected("data")}
                        className={`text-sm font-mediu cursor-pointer ${sectionSelected === "data" ? "underline" : ""}`}
                    >Data</span>
                </div>
                {sectionSelected == "items" && <LevelsPanel />}
                {sectionSelected == "data" && <SectionContainer>
                    <Section label="Datasets list">

                        {props.dataset && <Flex >
                            <Button
                                type="text"
                                icon={<Paperclip {...iconAttributes} />}
                                style={{ ...buttonStyle }}
                                onClick={() => props.datasetSelect()}
                            >{props.dataset.file.name}</Button>
                        </Flex>}
                    </Section>

                    <HR></HR>

                    <Section label="Add dataset">
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
                    </Section>
                </SectionContainer>

                }
            </div>
        </div>
    </>
}