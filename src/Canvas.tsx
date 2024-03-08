import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { isVertical } from "./utils/axis";
import { d3ExistOrAppend } from "./utils/d3";
import { _drawAxis, getAxisCode } from "./draw/drawAxis";
import { AxisPanel } from "./panels/axis/AxisPanel";
import { Axis, AxisType, CircularAxis, newBottomAxis, newCircularAxis, newLeftAxis } from "./state/aces/dto";
import { LinearAxis } from "./state/aces/dto";
import { BarPlot, LinePlot, PiePlot, Plot, ScatterPlot, isBar, isLine, isPie, isScatter, newBarPlot, newLinePlot, newPiePlot, newScatterPlot } from "./state/plots/dto";
import { PlotType } from "./state/dto";
import { drawScatter, getScatterCode } from "./draw/drawScatter";
import { ChartPanel } from "./panels/ChartPanel";
import { getColumn } from "./utils/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { setSelected } from "./state/selected/selectedSlice";
import { addAces, changeAxisKey, setAces } from "./state/aces/acesSlice";
import { drawChartSelection, drawSelection2 } from "./draw/drawSelector";
import { Dataset, Rect } from "./state/dto";
import { drag, handle1 } from "./state/chart/chartSlice";
import { addPlot, removePlot, replacePlot } from "./state/plots/plotsSlice";
import { MainPanel } from "./panels/MainPanel";
import { DatasetModal } from "./panels/DatasetModal";
import { drawPie, getPieCode } from "./draw/drawPie";
import { SetupModal } from "./panels/SetupModal";
import { ScatterPlotPanel } from "./panels/Plot/ScatterPlotPanel";
import { PiePlotPanel } from "./panels/Plot/PiePlotPanel";
import { LinePlotPanel } from "./panels/Plot/LinePlotPanel";
import { drawLine, getLineCode } from "./draw/drawLine";
import { drawBar } from "./draw/drawBar";
import { BarPlotPanel } from "./panels/Plot/BarPlotPanel";
import { exportPng, exportSvg } from "./utils/export-svg";


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

    const getAxis = (id: string | undefined): Axis | undefined => {
        if (!id) return undefined
        return aces.find(ax => ax.id == id)
    }

    const svgRef = useRef(null)
    const hiddenSvgRef = useRef(null)

    const initialize = () => {
        const svg = d3.select(svgRef.current)
            .on("click", () => dispatch(setSelected(undefined)))

        svg.selectChild("g").remove()

        const _svg = svg.append("g").attr("class", props.plotId)

        const chartBox = _svg.append("g").attr("class", "chartBox")
            // .on("mouseover", function(d,i){
            //     console.log("hover")
            //     console.log(d3.select(this).select("g.selectorBox"))
            //     d3.select(this).select("g.selectorBox").attr("display", "initial")
            // })

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

        if (chart.hidden) return

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
            .on("mouseover", function(d,i){
                dispatch(setSelected({ type: "chart", key: "chart.name" }))
                // console.log("hover")
                // console.log(d3.select(this).select("g.selectorBox"))
                // d3.select(this).select("g.selectorBox").attr("display", "initial")
            })
            .on("mouseout", function(d,i){
                dispatch(setSelected(undefined))
                // console.log("hover")
                // console.log(d3.select(this).select("g.selectorBox"))
                // d3.select(this).select("g.selectorBox").attr("display", "initial")
            })

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
                    const xAxis = newBottomAxis(dataset ? dataset.props[0].key : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props[1].key : "")
                    const plot = newScatterPlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break;
                }
                case PlotType.LINE: {
                    const xAxis = newBottomAxis(dataset ? dataset.props[0].key : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props[1].key : "")
                    const plot = newLinePlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break;
                }
                case PlotType.BAR: {
                    const xAxis = newBottomAxis(dataset ? dataset.props.find(p => p.type === "discrete")?.key : "")
                    const yAxis = newLeftAxis(dataset ? dataset.props.find(p => p.type !== "discrete")?.key : "")
                    const plot = newBarPlot(xAxis.id, yAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([xAxis, yAxis]))
                    dispatch(changeAxisKey({ axis: xAxis, dataset: dataset, newKey: xAxis.key }))
                    dispatch(changeAxisKey({ axis: yAxis, dataset: dataset, newKey: yAxis.key }))
                    break
                }
                case PlotType.PIE: {
                    const circularAxis = newCircularAxis(dataset ? dataset.props.find(p => p.type === "continous")?.key : "")
                    const plot = newPiePlot(circularAxis.id)
                    dispatch(addPlot(plot))
                    dispatch(addAces([circularAxis]))
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
            case PlotType.BAR:
                const _plot = plot as BarPlot
                plt = drawBar(_svg, _plot, data, getAxis(_plot.xAxis) as LinearAxis, getAxis(_plot.yAxis) as LinearAxis, chart)
                break;
            case PlotType.PIE: {
                const _plot = plot as PiePlot
                plt = drawPie(_svg, _plot, data, chart, getAxis(_plot.circularAxis) as CircularAxis)
                break;
            }
            default:
                break;
        }

        if (plt) {
            plt
                .attr("cursor", "pointer")
                .on("click", (e: any) => { e.stopPropagation(); dispatch(setSelected({ type: "plot", key: plot.name })) })

        }

    }

    const savePlot = (format: "svg" | "png") => {
        if (format == "svg")
            exportSvg(svgRef.current, hiddenSvgRef.current, chart.fileName ?? chart.name)
        else
            exportPng(svgRef.current, hiddenSvgRef.current, chart.fileName ?? chart.name)
    }

    const getCode = () => {

        if (!plots[0]) return

        const acesCode = aces.map(ax => getAxisCode(ax, chart)).join("\n")

        let plotCode = ""
        switch (plots[0].type) {
            case PlotType.SCATTER:
                plotCode = getScatterCode(
                    plots[0] as ScatterPlot,
                    aces[0] as LinearAxis,
                    aces[1] as LinearAxis,
                    chart)
                break;
            case PlotType.LINE:
                plotCode = getLineCode(
                    plots[0] as LinePlot,
                    aces[0] as LinearAxis,
                    aces[1] as LinearAxis,
                    chart)
                break;
            case PlotType.PIE:
                plotCode = getPieCode(
                    plots[0] as PiePlot,
                    aces[0] as CircularAxis,
                    chart)
                break;
            default:
                break;
        }

        const code = `
${acesCode}
${plotCode}
        `
        // console.log(code);
        // setCodeExport(code)
        navigator.clipboard.writeText(code)
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
            if (plots[0] && plots[0].type != PlotType.BAR) {
                if (aces.some(ax => ax.type === AxisType.Linear)) {
                    dispatch(setAces([...aces.filter(ax => ax.type === AxisType.Linear).map(ax => ax as LinearAxis).map((ax, id) => {
                        const key = dataset.props[id].key
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
                else {
                    dispatch(setAces([...aces.filter(ax => ax.type === AxisType.Circular).map(ax => ax as CircularAxis).map(ax => {
                        const newAx: CircularAxis = {
                            ...ax,
                            key: dataset.props[0].key
                        }
                        return newAx
                    })]))
                }
            }
            else if (plots[0] && plots[0].type == PlotType.BAR) {
                dispatch(setAces([...aces]))
            }
        }
    }, [dataset])


    return <div className="hidden md:block">

        <div className="svg-container">
            <svg ref={svgRef}
                id={"svg"}
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
        </div>

        <div className="" ref={hiddenSvgRef}></div>

        <MainPanel
            datasets={dataset ? [dataset] : []}
            setDataset={ds => setDataset(ds)}
            datasetSelect={() => { dispatch(setSelected(undefined)); setDataModalOpen(true) }}
            onExport={savePlot}
            onGetCode={getCode}
        />

        <DatasetModal
            open={dataModalOpen}
            onClose={() => setDataModalOpen(false)}
            dataset={dataset}
        />

        <div id="default-sidebar" className={`overflow-y-scroll fixed top-0 pt-14 px-2 pb-6 right-0 z-40 w-[240px] h-screen transition-transform  ${!!selection ? "" : "translate-x-60"}  bg-white shadow-2xl `} aria-label="Sidebar">

            {selection?.type === "axis" && <AxisPanel dataset={dataset} />}

            {(selection?.type === "plot" && plots[0] !== undefined) && <>

                {isScatter(plots[0]) &&
                    <ScatterPlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

                {isLine(plots[0]) &&
                    <LinePlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

                {isBar(plots[0]) &&
                    <BarPlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

                {isPie(plots[0]) &&
                    <PiePlotPanel
                        dataset={dataset}
                        changePlotType={onPlotTypeChange}
                    />}

            </>}

            {selection?.type === "chart" && <ChartPanel onExport={savePlot} onGetCode={getCode} />}

        </div>

        {/* {console.log((d3.select(svgRef.current) as any).getBoundingClientRect())} */}

        <SetupModal
            dataset={dataset}
            setDataset={ds => setDataset(ds)}
        />

    </div>
}