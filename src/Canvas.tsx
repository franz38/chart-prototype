import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Drawer } from 'antd';
import { isVertical } from "./utils/axis";
import { d3ExistOrAppend } from "./utils/d3";
import { _drawAxis } from "./draw/drawAxis";
import { AxisPanel } from "./panels/axis/AxisPanel";
import { Axis, AxisType, CircularAxis, newBottomAxis, newCircularAxis, newLeftAxis, newRadarAxis } from "./state/aces/dto";
import { LinearAxis } from "./state/aces/dto";
import { LinePlot, PiePlot, Plot, ScatterPlot, SpiderPlot, newColumnsPlot, newLinePlot, newPiePlot, newScatterPlot, newSpiderPlot } from "./state/plots/dto";
import { PlotType } from "./state/dto";
import { drawScatter } from "./draw/drawScatter";
import { ChartPanel } from "./panels/ChartPanel";
import { getColumn } from "./utils/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { setSelected } from "./state/selected/selectedSlice";
import { addAces, changeAxisKey, changeRadarAxisKey, setAces } from "./state/aces/acesSlice";
import { drawChartSelection, drawSelection2 } from "./draw/drawSelector";
import { Dataset, Rect } from "./state/dto";
import { drag, handle1 } from "./state/chart/chartSlice";
import { addPlot, removePlot, replacePlot } from "./state/plots/plotsSlice";
import { MainPanel } from "./panels/MainPanel";
import { DatasetModal } from "./panels/DatasetModal";
import { drawPie } from "./draw/drawPie";
import { SetupModal } from "./panels/SetupModal";
import { ScatterPlotPanel } from "./panels/Plot/ScatterPlotPanel";
import { PiePlotPanel } from "./panels/Plot/PiePlotPanel";
import { LinePlotPanel } from "./panels/Plot/LinePlotPanel";
import { drawLine } from "./draw/drawLine";
import { drawSpider } from "./draw/drawSpider";


/**
 * 
 * g (tranlate)
 * - g.axisBox
 * - - g.axis
 * - - g.selection
 * 
 */


export const Canvas = (props: { plotId: string }) => {

    const dispatch = useDispatch()

    const chart = useSelector((state: RootState) => state.chart)
    const aces = useSelector((state: RootState) => state.aces)
    const selection = useSelector((state: RootState) => state.selection.selection)
    const plots = useSelector((state: RootState) => state.plots)
    const [dataset, setDataset] = useState<Dataset>();
    const [dataModalOpen, setDataModalOpen] = useState<boolean>(false)
    const [mainPanelOpen, setMainPanelOpen] = useState<boolean>(false)

    const getAxis = (id: string | undefined): Axis | undefined => {
        if (!id) return undefined
        return aces.find(ax => ax.id == id)
    }

    const svgRef = useRef(null)

    const initialize = () => {
        const svg = d3.select(svgRef.current)
            .on("click", () => dispatch(setSelected(undefined)))

        svg.selectChild("g").remove()

        const _svg = svg.append("g").attr("class", props.plotId)

        const chartBox = _svg.append("g").attr("class", "chartBox")

        chartBox.append("g").attr("class", "shapes")
        const chartSelectorBox = chartBox
            .append("g")
            .attr("class", "selectorBox")
        chartSelectorBox.append("rect")
            .attr("class", "selector")
            .attr("fill", "transparent")
            .attr("stroke", "#03a9f4")
            .attr("stroke-width", 2)
            .call((d3.drag() as any)
                .on("drag", (e: any) => {
                    dispatch(drag({ dx: (e.x - e.subject.x), dy: (e.y - e.subject.y) }))
                })
            )
        const handles = chartSelectorBox.append("g")
            .attr("class", "handles")
        handles.append("rect")
            .attr("class", "p1")
            .call((d3.drag() as any)
                .on("drag", (e: any) => {
                    console.log(e)
                    dispatch(handle1({ dx: (e.x - e.subject.x), dy: (e.y - e.subject.y) }))
                })
            )
        handles.selectAll("rect")
            .attr("fill", "#fff")
            .attr("stroke", "#03a9f4")
            .attr("stroke-width", 2)
            .attr("width", 10)
            .attr("height", 10)
            .attr("transform", "translate(-5 -5)")
            .style("cursor", "nwse-resize")


        const acesBox = _svg.append("g").attr("class", "acesBox")
        acesBox.append("g").attr("class", "shapes")
        acesBox.append("rect")
            .attr("class", "selector")
            .attr("fill", "transparent")
            .attr("stroke", "#03a9f4")
            .attr("stroke-width", 2)

        _svg.append("g").attr("class", "plotBox")
    }

    const drawSelection = () => {

        const _svg = d3.select(svgRef.current).select(`g.${props.plotId}`)

        _svg.select(".chartBox").select("g.selectorBox").attr("display", "none")
        _svg.select(".acesBox").select("rect.selector").attr("display", "none")

        if (selection) {
            switch (selection.type) {
                case "chart":
                    const selectionRect = _svg.select(".chartBox").select("g.selectorBox").attr("display", "initial").select("rect.selector")

                    const rr: Rect = {
                        x: - chart.padding[3],
                        y: - chart.padding[0],
                        w: chart.rect.w + chart.padding[1] + chart.padding[3],
                        h: chart.rect.h + chart.padding[2] + chart.padding[0]
                    }

                    drawChartSelection(selectionRect, chart)
                    const handles = _svg.select(".chartBox").select("g.selectorBox").select("g.handles")
                    handles.select("rect.p1")
                        .attr("x", rr.x)
                        .attr("y", rr.y)
                    handles.select("rect.p2")
                        .attr("x", rr.x + rr.w)
                        .attr("y", rr.y)
                    handles.select("rect.p3")
                        .attr("x", rr.x + rr.w)
                        .attr("y", rr.y + rr.h)
                    handles.select("rect.p4")
                        .attr("x", rr.x)
                        .attr("y", rr.y + rr.h)

                    break;
                case "axis":
                    const axis = aces.find(ax => (ax.id === selection.key && ax.type === AxisType.Linear)) as LinearAxis
                    if (!axis) return
                    const el = _svg.select(".acesBox").select(".shapes").select(`.${axis.position}`)
                    let tmpRect = (el as any).node().getBBox()
                    let rect: Rect = { ...tmpRect, w: tmpRect.width, h: tmpRect.height }

                    const axisSelection = _svg.select(".acesBox").select("rect.selector")
                        .attr("display", "initial")
                        .attr("transform", el.attr("transform"))

                    if (isVertical(axis))
                        rect = { ...rect, x: -rect.w, y: (rect.y ?? 0) - 4 }

                    drawSelection2(axisSelection, rect)



                    break;
                case "plot":
                    break;
                default:
                    break;
            }

        }
        // else
        //     selectionRect.attr("opacity", 0)

    }

    const drawChart = () => {

        const _svg = d3.select(svgRef.current).select(`g.${props.plotId}`)
            .attr("transform", `translate(${chart.rect.x}, ${chart.rect.y})`)
            .select("g.chartBox").select("g.shapes") as any

        const chartSvg = d3ExistOrAppend(
            _svg.select(`g.chart`),
            () => (_svg as any).append("g").attr("class", "chart")
        )

        const chartRect = d3ExistOrAppend(
            chartSvg.select("rect"),
            () => (chartSvg as any).append("rect")
        )
        chartRect
            .attr("x", - chart.padding[3])
            .attr("y", - chart.padding[0])
            .attr("width", chart.rect.w + chart.padding[1] + chart.padding[3])
            .attr("height", chart.rect.h + chart.padding[2] + chart.padding[0])
            .attr("fill", chart.backgroundColor)
            .on("click", (e) => { e.stopPropagation(); dispatch(setSelected({ type: "chart", key: "chart.name" })) })

    }

    const drawAxis = (_axis: LinearAxis | CircularAxis) => {
        const axNode = _drawAxis(_axis, chart, svgRef, props.plotId)
        if (axNode) {
            axNode
                .attr("cursor", "pointer")
                .on("click", (e: any) => { e.stopPropagation(); dispatch(setSelected({ type: "axis", key: _axis.id })) })
        }
    }


    const removePlotDraw = (plot: Plot) => {
        d3.select(svgRef.current).select(`g.${props.plotId}`).select('g.plotBox').select(`g.${plot.name}`).remove()
    }

    const removeAces = (_axis: Axis) => {
        d3
            .select(svgRef.current)
            .select(`g.${props.plotId}`)
            .select("g.acesBox")
            .select("g.shapes")
            .selectAll(`g`)
            .remove()
    }

    const onPlotTypeChange = (plot: Plot, newType: PlotType) => {

        if (plot.type === newType) return

        removePlotDraw(plot)

        if (newType === PlotType.LINE && plot.type === PlotType.SCATTER) {
            const newPlot = newLinePlot((plot as ScatterPlot).xAxis, (plot as ScatterPlot).yAxis)
            dispatch(replacePlot({ new: newPlot, old: plot }))
        }
        else if (newType === PlotType.SCATTER && plot.type === PlotType.LINE) {
            const newPlot = newScatterPlot((plot as LinePlot).xAxis, (plot as LinePlot).yAxis)
            dispatch(replacePlot({ new: newPlot, old: plot }))
        }
        else {
            if (newType === PlotType.PIE)
                aces.forEach(ax => removeAces(ax))
            dispatch(setAces([]))
            dispatch(removePlot(plot))
            switch (newType) {
                case PlotType.SCATTER: {
                    const xAxis = newBottomAxis(dataset ? dataset.props[0] : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props[1] : "")
                    const plot = newScatterPlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break;
                }
                case PlotType.LINE: {
                    const xAxis = newBottomAxis(dataset ? dataset.props[0] : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props[1] : "")
                    const plot = newLinePlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break;
                }
                case PlotType.COLUMNS: {
                    const xAxis = newBottomAxis(dataset ? dataset.props[0] : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props[1] : "")
                    const plot = newColumnsPlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break;
                }
                case PlotType.PIE: {
                    const circularAxis = newCircularAxis(dataset ? dataset.props[0] : "")
                    const plot = newPiePlot(circularAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([circularAxis]))
                    break;
                }
                case PlotType.SPIDER: {
                    const aces = dataset ? dataset.props.map(prop => newRadarAxis(prop)) : []
                    const plot = newSpiderPlot(aces.map(ax => ax.id))
                    dispatch(addPlot(plot))
                    dispatch(addAces(aces))
                    aces.forEach(ax => dispatch(changeRadarAxisKey({ axis: ax, dataset: dataset, newKey: ax.key })))
                    break;
                }
                default:
                    break;
            }
        }
    }

    const drawPlot = (plot: Plot, data: Dataset | undefined, _aces: Axis[]) => {

        if (!data) return

        const _svg = d3.select(svgRef.current).select(`g.${props.plotId}`).select('g.plotBox')
        let plt: any;


        switch (plot.type) {
            case PlotType.SCATTER: {
                const _plot = plot as ScatterPlot
                plt = drawScatter(_svg, _plot, data, getAxis(_plot.xAxis) as LinearAxis, getAxis(_plot.yAxis) as LinearAxis, chart)
                break;
            }
            case PlotType.LINE: {
                const _plot = plot as LinePlot
                plt = drawLine(_svg, _plot, data, getAxis(_plot.xAxis) as LinearAxis, getAxis(_plot.yAxis) as LinearAxis, chart)
                break;
            }
            // case PlotType.COLUMNS:
            //     plt = drawScatter(_svg, plot, data, getAxis(plot.xAxis) as LinearAxis, getAxis(plot.yAxis) as LinearAxis, chart)
            //     break;
            case PlotType.PIE: {
                const _plot = plot as PiePlot
                plt = drawPie(_svg, _plot, data, chart, getAxis(_plot.circularAxis) as CircularAxis)
                break;
            }
            case PlotType.SPIDER: {
                const _plot = plot as SpiderPlot
                plt = drawSpider(_svg, _plot, data, _plot.aces.map(ax => getAxis(ax) as LinearAxis), chart)
                break;
            }
            // case PlotType.CIRCULAR_BAR:
            //     plt = drawCircularBar(_svg, plot, data, xAxis, yAxis, chart)
            //     break;
            default:
                break;
        }

        if (plt) {
            plt
                .attr("cursor", "pointer")
                .on("click", (e: any) => { e.stopPropagation(); dispatch(setSelected({ type: "plot", key: plot.name })) })

        }

    }

    useEffect(() => {
        // dispatch(setAces([...aces.map(ax => ({ ...ax, scale: {...ax.scale, range: ax.invert ? [ax.width, 0] : [0, ax.width]} }))]))
        initialize()
    }, [])

    useEffect(() => {
        plots.forEach(plot => drawPlot(plot, dataset, aces))
        aces.forEach(axis => drawAxis(axis))
    }, [chart, aces, plots])

    useEffect(() => {
        drawChart()
        drawSelection()
    }, [chart])

    // useEffect(() => {
    //     let plt = plots[0]
    //     if (plt.type === PlotType.SCATTER){
    //         if (!(plt as ScatterPlot).xAxis && !(plt as ScatterPlot).yAxis) {
    //             dispatch(updatePlot({
    //                 ...plots[0],
    //                 xAxis: aces.find(ax => !isVertical(ax as LinearAxis))?.id,
    //                 yAxis: aces.find(ax => isVertical(ax as LinearAxis))?.id
    //             }))
    //         }
    //     }
    // }, [aces])

    useEffect(() => {
        plots.forEach(plot => drawPlot(plot, dataset, aces))
    }, [plots])

    useEffect(() => {
        drawSelection()
    }, [selection])

    useEffect(() => {
        if (dataset) {
            if (aces.some(ax => ax.type === AxisType.Linear)){
                dispatch(setAces([...aces.filter(ax => ax.type === AxisType.Linear).map(ax => ax as LinearAxis).map((ax, id) => {
                    const key = dataset.props[id]
                    const data = getColumn(dataset, key)
                    let domain: number[] = [Math.min(...data), Math.max(...data)]
                    const newAx: LinearAxis = {
                        ...ax,
                        key: key,
                        scale: { ...ax.scale, props: { ...ax.scale.props, domain: domain } }
                    }
                    return newAx
                })]))
            }
            else{
                dispatch(setAces([...aces.filter(ax => ax.type === AxisType.Circular).map(ax => ax as CircularAxis).map(ax => {
                    const newAx: CircularAxis = {
                        ...ax,
                        key: dataset.props[0]
                    }
                    return newAx
                })]))
            }
        }
    }, [dataset])


    return <>

        <svg ref={svgRef}
            transform="translate(0 0)"
            onContextMenu={e => e.preventDefault()}
            style={{ height: "100vh", width: "calc(100vw)" }}
        >
            <defs>
                <pattern id="dottedPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="2" fill="#eee" />
                </pattern>
            </defs>
            <rect width='800%' height='800%' transform='translate(0,0)' fill='url(#dottedPattern)' />
        </svg>

        {/* <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
            <defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'>
                <rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)' />
                <path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)' /></pattern>
            </defs>
            <rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' />
        </svg> */}

        <MainPanel
            visible={mainPanelOpen}
            dataset={dataset}
            setDataset={ds => setDataset(ds)}
            datasetSelect={() => { dispatch(setSelected(undefined)); setDataModalOpen(true) }}
        />

        <DatasetModal
            open={dataModalOpen}
            onClose={() => setDataModalOpen(false)}
            dataset={dataset}
        />

        <Drawer
            placement="right"
            open={!!selection}
            mask={false}
            closable={false}
            width={240}
            styles={{ body: { padding: "24px 12px" } }}
        >
            {selection?.type === "axis" && <AxisPanel dataset={dataset} />}

            {(selection?.type === "plot" && plots[0] !== undefined) && <>

                {plots[0].type === PlotType.SCATTER &&
                    <ScatterPlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

                {plots[0].type === PlotType.LINE &&
                    <LinePlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

                {plots[0].type === PlotType.PIE &&
                    <PiePlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

            </>}

            {selection?.type === "chart" && <ChartPanel />}

        </Drawer>

        <SetupModal
            dataset={dataset}
            setDataset={ds => setDataset(ds)}
            onSetupEnd={() => {
                setMainPanelOpen(true)
            }}
        />

    </>
}