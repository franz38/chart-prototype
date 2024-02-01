import { Button, Flex, Modal, Steps, Upload, UploadFile } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addPlot } from "../state/plots/plotsSlice"
import { newLinePlot, newPiePlot, newScatterPlot } from "../state/plots/dto"
import { loadLocalDs, onFileUpload } from "../utils/data"
import { Dataset, PlotType } from "../state/dto"
import { newBottomAxis, newCircularAxis, newLeftAxis } from "../state/aces/dto"
import { addAces, changeAxisKey } from "../state/aces/acesSlice"
import { UploadChangeParam } from "antd/es/upload"
import { UploadIcon } from "lucide-react"
import { setSelected } from "../state/selected/selectedSlice"

interface SetupModalProps {
    dataset: Dataset | undefined;
    setDataset: (ds: Dataset) => void;
    onSetupEnd: () => void;
}

export const SetupModal = (props: SetupModalProps) => {

    const dispatch = useDispatch()

    const [step, setStep] = useState<number>(-1)

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
                dispatch(setSelected({type: "plot", key: plot.name}))
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
                dispatch(setSelected({type: "plot", key: plot.name}))
                break;
            }
            case PlotType.PIE: {
                const circularAxis = newCircularAxis(props.dataset ? props.dataset.props[0] : "")
                const plot = newPiePlot(circularAxis.id)
                dispatch(addPlot(plot))
                dispatch(addAces([circularAxis]))
                dispatch(setSelected({type: "plot", key: plot.name}))
                break;
            }
            // case PlotType.COLUMNS: {
            //     const xAxis = newBottomAxis(props.dataset ? props.dataset.props[0] : "")
            //     const yAxis = newLeftAxis(props.dataset ? props.dataset.props[1] : "")
            //     const plot = newColumnsPlot(xAxis.id, yAxis.id)
            //     dispatch(addPlot(plot))
            //     dispatch(addAces([xAxis, yAxis]))
            //     dispatch(changeAxisKey({ axis: xAxis, dataset: props.dataset, newKey: xAxis.key }))
            //     dispatch(changeAxisKey({ axis: yAxis, dataset: props.dataset, newKey: yAxis.key }))
            //     dispatch(setSelected({type: "plot", key: plot.name}))
            //     break;
            // }
            // case PlotType.SPIDER: {
            //     const aces = props.dataset ? props.dataset.props.map(prop => newRadarAxis(prop)) : []
            //     const plot = newSpiderPlot(aces.map(ax => ax.id))
            //     dispatch(addPlot(plot))
            //     dispatch(addAces(aces))
            //     aces.forEach(ax => dispatch(changeRadarAxisKey({axis: ax, dataset: props.dataset, newKey: ax.key})))
            //     dispatch(setSelected({type: "plot", key: plot.name}))
            //     break;
            // }
            default:
                break;
        }
    }

    const onFileInputChange = async (info: UploadChangeParam<UploadFile<any>>) => {
        const ds = await onFileUpload(info.file.originFileObj)
        if (ds) props.setDataset(ds)
    }

    const setupScatter = async () => {
        props.setDataset(await loadLocalDs("./world_cups.csv"))
        generatePlot(PlotType.SCATTER)
        setStep(3)
        props.onSetupEnd()
    }

    const setupLine = async () => {
        props.setDataset(await loadLocalDs("./world_cups.csv"))
        generatePlot(PlotType.LINE)
        setStep(3)
        props.onSetupEnd()
    }

    const setupPie = async () => {
        props.setDataset(await loadLocalDs("./package.csv"))
        generatePlot(PlotType.PIE)
        setStep(3)
        props.onSetupEnd()
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
            centered
        >
            {step < 0 && <>
                <Flex vertical align="center" gap={20}>
                    <span className="welcomeText">Welcome to QuickCharts</span>
                    <br></br>
                    <Flex gap={20}>
                        <div className="demo-box" onClick={() => setupScatter()}>
                            <img src="./plot_illustrations/ScatterPlot.png"></img>
                            <span>Scatter plot</span>
                        </div>
                        <div className="demo-box" onClick={() => setupLine()}>
                            <img src="./plot_illustrations/LinePlot.png"></img>
                            <span>Line plot</span>
                        </div>
                        <div className="demo-box" onClick={() => setupPie()}>
                            <img src="./plot_illustrations/PiePlot.png"></img>
                            <span>Pie plot</span>
                        </div>
                        <div className="demo-box" onClick={() => setStep(step+1)}>
                            <img src="./plot_illustrations/empty.png"></img>
                            <span>Empty canvas</span>
                        </div>
                    </Flex>
                </Flex>
            </>}

            {step >= 0 && <><Steps
                size="small"
                current={step}
                items={[
                    { title: "Select data" },
                    { title: "Choose plot type" }
                ]}
                style={{ width: "20rem", margin: "auto", padding: "0rem 0px 4rem 0px" }}
            />
            <Flex vertical style={{ width: "20rem", margin: "auto" }} gap={10}>
                {step === 0 && <>

                    <Flex vertical gap={10}>

                        <Button onClick={async () => {
                            props.setDataset(await loadLocalDs("./world_cups.csv"));
                            setStep(step + 1)
                        }}>Random dataset</Button>

                        <Button onClick={async () => { setStep(step + 1) }}>No dataset (you can add one later)</Button>

                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // beforeUpload={beforeUpload}
                            onChange={(f) => { onFileInputChange(f); setStep(step + 1) }}
                            style={{ width: "100%", }}
                            
                        >
                            <Flex vertical justify="center" align="center">
                            {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                            <UploadIcon />
                            <button style={{ border: 0, background: 'none', paddingTop: ".2rem" }} type="button">
                                {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
                                {/* <PlusOutlined /> */}
                                <div style={{ marginTop: 8 }}>Upload dataset</div>
                            </button>

                            </Flex>
                        </Upload>

                    </Flex>
                </>}
                {step === 1 && <Flex vertical gap={10}>
                    <Button onClick={() => { props.onSetupEnd(); generatePlot(PlotType.SCATTER); setStep(step + 1) }}>Scatter plot</Button>
                    <Button onClick={() => { props.onSetupEnd(); generatePlot(PlotType.LINE); setStep(step + 1) }}>Line plot</Button>
                    <Button onClick={() => { props.onSetupEnd(); generatePlot(PlotType.PIE); setStep(step + 1) }}>Pie plot</Button>
                </Flex>}
            </Flex></>}
        </Modal>
    </>
}