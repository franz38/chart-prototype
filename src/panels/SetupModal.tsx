import { Button, Flex, Modal, Steps, Upload, UploadFile } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addPlot } from "../state/plots/plotsSlice"
import { newColumnsPlot, newLinePlot, newPiePlot, newScatterPlot, newSpiderPlot } from "../state/plots/dto"
import { loadLocalDs, onFileUpload } from "../utils/data"
import { Dataset, PlotType } from "../state/dto"
import { newBottomAxis, newCircularAxis, newLeftAxis, newRadarAxis } from "../state/aces/dto"
import { addAces, changeAxisKey, changeRadarAxisKey } from "../state/aces/acesSlice"
import { UploadChangeParam } from "antd/es/upload"

interface SetupModalProps {
    dataset: Dataset | undefined;
    setDataset: (ds: Dataset) => void;
}

export const SetupModal = (props: SetupModalProps) => {

    const dispatch = useDispatch()

    const [step, setStep] = useState<number>(0)

    const generatePlot = (plotType: PlotType) => {
        switch (plotType) {
            case PlotType.SCATTER: {
                const xAxis = newBottomAxis(props.dataset ? props.dataset.props[0] : "")
                const yAxis = newLeftAxis(props.dataset ? props.dataset.props[1] : "")
                const plot = newScatterPlot(xAxis.id, yAxis.id)
                dispatch(addPlot(plot))
                dispatch(addAces([xAxis, yAxis]))
                dispatch(changeAxisKey({ axis: xAxis, dataset: props.dataset, newKey: xAxis.key }))
                dispatch(changeAxisKey({ axis: yAxis, dataset: props.dataset, newKey: yAxis.key }))
                break;
            }
            case PlotType.LINE: {
                const xAxis = newBottomAxis(props.dataset ? props.dataset.props[0] : "")
                const yAxis = newLeftAxis(props.dataset ? props.dataset.props[1] : "")
                const plot = newLinePlot(xAxis.id, yAxis.id)
                dispatch(addPlot(plot))
                dispatch(addAces([xAxis, yAxis]))
                dispatch(changeAxisKey({ axis: xAxis, dataset: props.dataset, newKey: xAxis.key }))
                dispatch(changeAxisKey({ axis: yAxis, dataset: props.dataset, newKey: yAxis.key }))
                break;
            }
            case PlotType.COLUMNS: {
                const xAxis = newBottomAxis(props.dataset ? props.dataset.props[0] : "")
                const yAxis = newLeftAxis(props.dataset ? props.dataset.props[1] : "")
                const plot = newColumnsPlot(xAxis.id, yAxis.id)
                dispatch(addPlot(plot))
                dispatch(addAces([xAxis, yAxis]))
                dispatch(changeAxisKey({ axis: xAxis, dataset: props.dataset, newKey: xAxis.key }))
                dispatch(changeAxisKey({ axis: yAxis, dataset: props.dataset, newKey: yAxis.key }))
                break;
            }
            case PlotType.PIE: {
                const circularAxis = newCircularAxis(props.dataset ? props.dataset.props[0] : "")
                const plot = newPiePlot(circularAxis.id)
                dispatch(addPlot(plot))
                dispatch(addAces([circularAxis]))
                break;
            }
            case PlotType.SPIDER: {
                const aces = props.dataset ? props.dataset.props.map(prop => newRadarAxis(prop)) : []
                const plot = newSpiderPlot(aces.map(ax => ax.id))
                dispatch(addPlot(plot))
                dispatch(addAces(aces))
                aces.forEach(ax => dispatch(changeRadarAxisKey({axis: ax, dataset: props.dataset, newKey: ax.key})))
                break;
            }
            default:
                break;
        }
    }

    const onFileInputChange = async (info: UploadChangeParam<UploadFile<any>>) => {
        const ds = await onFileUpload(info.file.originFileObj)
        if (ds) props.setDataset(ds)
    }


    return <>
        <Modal
            open={step <= 1}
            styles={{
                content: {
                    borderColor: "rgb(213, 213, 213)",
                    boxShadow: "none",
                    padding: "4rem"
                }
            }}
            footer={null}
            closable={false}
        >
            <Steps
                size="small"
                current={step}
                items={[
                    { title: "Select data" },
                    { title: "Choose plot type" }
                ]}
                style={{ width: "20rem", margin: "auto", padding: "0rem 0px 2rem 0px" }}
            />
            <Flex vertical style={{ width: "20rem", margin: "auto" }} gap={10}>
                {step === 0 && <>

                    <Flex vertical gap={10}>

                        <Button onClick={async () => {
                            props.setDataset(await loadLocalDs("./package.csv"));
                            setStep(step + 1)
                        }}>Random dataset</Button>

                        <Button onClick={async () => { setStep(step + 1) }}>No dataset</Button>

                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // beforeUpload={beforeUpload}
                            onChange={(f) => { onFileInputChange(f); setStep(step + 1) }}
                            style={{ width: "100%", }}

                        >
                            {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                            <button style={{ border: 0, background: 'none' }} type="button">
                                {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
                                {/* <PlusOutlined /> */}
                                <div style={{ marginTop: 8 }}>Upload dataset</div>
                            </button>
                        </Upload>

                    </Flex>
                </>}
                {step === 1 && <Flex vertical gap={10}>
                    <Button onClick={() => { generatePlot(PlotType.SCATTER); setStep(step + 1) }}>Scatter plot</Button>
                    <Button onClick={() => { generatePlot(PlotType.LINE); setStep(step + 1) }}>Line plot</Button>
                    <Button onClick={() => { generatePlot(PlotType.COLUMNS); setStep(step + 1) }}>Columns plot</Button>
                    <Button onClick={() => { generatePlot(PlotType.PIE); setStep(step + 1) }}>Pie plot</Button>
                </Flex>}
            </Flex>
        </Modal>
    </>
}