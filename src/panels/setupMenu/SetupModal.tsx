import { Steps, Upload, UploadFile } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPlot } from "../../state/plots/plotsSlice";
import {
  newBarPlot,
  newLinePlot,
  newPiePlot,
  newScatterPlot,
  newSpiderPlot,
} from "../../state/plots/dto";
import { getRange, loadLocalDs, onFileUpload } from "../../utils/data";
import { Dataset, PlotType } from "../../state/dto";
import { newBottomAxis, newCircularAxis, newLeftAxis } from "../../state/aces/dto";
import { addAces, changeAxisKey } from "../../state/aces/acesSlice";
import { UploadChangeParam } from "antd/es/upload";
import { UploadIcon } from "lucide-react";
import { setSelected } from "../../state/selected/selectedSlice";
import { resizeH, resizeW, setColor, setStyle, show } from "../../state/chart/chartSlice";
import * as d3 from "d3";
import { getComplementary, randomColor } from "../../utils/colors";
import { toggleMainPanel } from "../../state/layout/layoutSlice";
import { TemplateButton } from "./TemplateButton";
import { transparentize } from "color2k";

interface SetupModalProps {
  dataset: Dataset | undefined;
  setDataset: (ds: Dataset) => void;
}

export const SetupModal = (props: SetupModalProps) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState<number>(-1);

  const generatePlot = (plotType: PlotType) => {
    switch (plotType) {
      case PlotType.SCATTER: {
        const xAxis = newBottomAxis(
          props.dataset ? props.dataset.props[0].key : "",
        );
        const yAxis = newLeftAxis(
          props.dataset ? props.dataset.props[1].key : "",
        );
        const plot = newScatterPlot(xAxis.id, yAxis.id);
        dispatch(addPlot(plot));
        dispatch(addAces([xAxis, yAxis]));
        dispatch(
          changeAxisKey({
            axis: xAxis,
            dataset: props.dataset,
            newKey: xAxis.key,
          }),
        );
        dispatch(
          changeAxisKey({
            axis: yAxis,
            dataset: props.dataset,
            newKey: yAxis.key,
          }),
        );
        dispatch(setSelected({ type: "plot", key: plot.name }));
        break;
      }
      case PlotType.LINE: {
        const xAxis = newBottomAxis(
          props.dataset ? props.dataset.props[0].key : "",
        );
        const yAxis = newLeftAxis(
          props.dataset ? props.dataset.props[1].key : "",
        );
        const plot = newLinePlot(xAxis.id, yAxis.id);
        dispatch(addPlot(plot));
        dispatch(addAces([xAxis, yAxis]));
        dispatch(
          changeAxisKey({
            axis: xAxis,
            dataset: props.dataset,
            newKey: xAxis.key,
          }),
        );
        dispatch(
          changeAxisKey({
            axis: yAxis,
            dataset: props.dataset,
            newKey: yAxis.key,
          }),
        );
        dispatch(setSelected({ type: "plot", key: plot.name }));
        break;
      }
      case PlotType.PIE: {
        const circularAxis = newCircularAxis(
          props.dataset
            ? props.dataset.props.find((p) => p.type === "continous")?.key
            : "",
        );
        const plot = newPiePlot(circularAxis.id);
        dispatch(resizeW(plot.radius * 2));
        dispatch(addPlot(plot));
        dispatch(addAces([circularAxis]));
        dispatch(setSelected({ type: "plot", key: plot.name }));
        break;
      }
      case PlotType.BAR: {
        const xAxis = newBottomAxis(
          props.dataset ? props.dataset.props[0].key : "",
        );
        const yAxis = newLeftAxis(
          props.dataset ? props.dataset.props[1].key : "",
        );
        const plot = newBarPlot(xAxis.id, yAxis.id);
        dispatch(addPlot(plot));
        dispatch(addAces([xAxis, yAxis]));
        dispatch(
          changeAxisKey({
            axis: xAxis,
            dataset: props.dataset,
            newKey: xAxis.key,
          }),
        );
        dispatch(
          changeAxisKey({
            axis: yAxis,
            dataset: props.dataset,
            newKey: yAxis.key,
          }),
        );
        dispatch(setSelected({ type: "plot", key: plot.name }));
        break;
      }
      default:
        break;
    }

    const _svg = d3.select("svg#svg");
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }
  };

  const alignChart = () => {
    const _svg = d3.select("svg#svg");
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }
  };

  const onFileInputChange = async (
    info: UploadChangeParam<UploadFile<any>>,
  ) => {
    const ds = await onFileUpload(info.file.originFileObj);
    if (ds) props.setDataset(ds);
  };

  // const setupScatter = async () => {
  //   const ds = await loadLocalDs("./life_expectancy.csv");
  //   const xAxis = newBottomAxis(
  //     props.dataset ? props.dataset.props[0].key : "",
  //   );
  //   const yAxis = newLeftAxis(props.dataset ? props.dataset.props[1].key : "");
  //   const plot = newScatterPlot(xAxis.id, yAxis.id);
  //   const domain = getRange(ds, ds.props[0].key) ?? ([] as any);
  //   const range = (getRange(ds, ds.props[0].key) ?? []).map((_: any) =>
  //     randomColor(),
  //   );
  //   if (range.length == 2) range[1] = getComplementary(range[0]);

  //   dispatch(
  //     addPlot({
  //       ...plot,
  //       color: {
  //         ...plot.color,
  //         key: ds.props[0].key,
  //         domain: domain,
  //         range: range,
  //       },
  //       size: {
  //         ...plot.size,
  //         key: ds.props[1].key,
  //         domain: getRange(ds, ds.props[1].key) ?? ([] as any),
  //         range: [2, 5],
  //       } as any,
  //     }),
  //   );
  //   dispatch(addAces([xAxis, yAxis]));
  //   dispatch(
  //     changeAxisKey({ axis: xAxis, dataset: props.dataset, newKey: xAxis.key }),
  //   );
  //   dispatch(
  //     changeAxisKey({ axis: yAxis, dataset: props.dataset, newKey: yAxis.key }),
  //   );
  //   dispatch(setSelected({ type: "plot", key: plot.name }));

  //   const _svg = d3.select("svg#svg");
  //   if (_svg) {
  //     const W = (_svg as any).node().getBoundingClientRect().width;
  //     const H = (_svg as any).node().getBoundingClientRect().height;
  //     dispatch(show({ width: W, height: H }));
  //   } else {
  //     dispatch(show({ width: 0, height: 0 }));
  //   }

  //   props.setDataset(ds);
  //   dispatch(toggleMainPanel());
  //   setStep(3);
  // };

  const setupScatterDemo2 = async () => {
    const ds = await loadLocalDs("./life_expectancy.csv");
    let xAxis = newBottomAxis(ds ? ds.props[3].key : "") ;
    let yAxis = newLeftAxis(ds ? ds.props[2].key : "")

    xAxis = {...xAxis, showGrid: true, style: { ...xAxis.style, tickColor: "#5555554c", lineVisible: false }}
    yAxis = {...yAxis, showGrid: true, style: { ...yAxis.style, tickColor: "#5555554c", lineVisible: false }}

    const plot = newScatterPlot(xAxis.id, yAxis.id);
    const domain = getRange(ds, ds.props[4].key) ?? ([] as any);
    const range = ["#1F77B4", "#FF7F0F", "#2AA02B", "#D62727", "#9367BD", "#8B554B"].map(c => transparentize(c, 0.5))
    if (range.length == 2) range[1] = getComplementary(range[0]);

    dispatch(
      addPlot({
        ...plot,
        color: {
          ...plot.color,
          key: ds.props[4].key,
          domain: domain,
          range: range,
        },
        size: {
          ...plot.size,
          key: ds.props[3].key,
          domain: getRange(ds, ds.props[3].key) ?? ([] as any),
          range: [3, 25],
        } as any,
      }),
    );
    dispatch(addAces([xAxis, yAxis]));
    dispatch(
      changeAxisKey({ axis: xAxis, dataset: ds, newKey: xAxis.key }),
    );
    dispatch(
      changeAxisKey({ axis: yAxis, dataset: ds, newKey: yAxis.key }),
    );
    dispatch(setSelected({ type: "plot", key: plot.name }));
    
    dispatch(setStyle({
      backgroundColor: "#FFFBF1",
      W: 560,
      H: 300
    }))

    const _svg = d3.select("svg#svg");
    
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }

    props.setDataset(ds);
    dispatch(toggleMainPanel());
    setStep(3);
  };

  const setupLine = async () => {
    props.setDataset(await loadLocalDs("./world_cups.csv"));
    generatePlot(PlotType.LINE);
    dispatch(toggleMainPanel());
    setStep(3);
  };

  const setupBar = async () => {
    const ds = await loadLocalDs("./random_ds.csv");

    let xAxis = newBottomAxis(ds ? ds.props[0].key : "");
    let yAxis = newLeftAxis(ds ? ds.props[2].key : "");

    xAxis = {...xAxis, style: { ...xAxis.style, tickColor: "#d7d7d7", lineColor: "#d7d7d7", fontColor: "#d7d7d7" }}
    yAxis = {...yAxis, scale: {...yAxis.scale, props: {...yAxis.scale.props, domain: [0,70]} }, style: { ...yAxis.style, tickColor: "#d7d7d7", lineColor: "#d7d7d7", fontColor: "#d7d7d7" }}

    const plot = newBarPlot(xAxis.id, yAxis.id);

    const domain = getRange(ds, ds.props[1].key) ?? [];
    let range = ["#85669e", "#602425", "#f07586"];
    if (range.length == 2) range[1] = getComplementary(range[0]);

    dispatch(
      addPlot({
        ...plot,
        fill: {
          ...plot.fill,
          key: ds.props[1].key,
          domain: domain,
          range: range,
        } as any,
        color: "#ffffff"
      }),
    );
    dispatch(setStyle({
      backgroundColor: "#2d3238",
      W: 560,
      H: 280
    }))
    dispatch(addAces([xAxis, yAxis]));
    dispatch(changeAxisKey({ axis: xAxis, dataset: ds, newKey: xAxis.key }));
    dispatch(changeAxisKey({ axis: yAxis, dataset: ds, newKey: yAxis.key }));
    dispatch(setSelected({ type: "plot", key: plot.name }));

    props.setDataset(ds);
    alignChart();
    dispatch(toggleMainPanel());
    setStep(3);
  };

  const setupDonutDemo = async () => {
    const ds = await loadLocalDs("./user_acquisition.csv");

    const circularAxis = newCircularAxis(ds ? ds.props[0].key : "");
    const plot = newPiePlot(circularAxis.id);

    const domain = getRange(ds, ds.props[1].key) ?? [];
    let range = (getRange(ds, ds.props[1].key) ?? []).map((_) => randomColor());
    if (range.length == 2) range[1] = getComplementary(range[0]);

    dispatch(resizeW(plot.radius * 2));
    dispatch(addAces([circularAxis]));
    dispatch(
      addPlot({
        ...plot,
        color: {
          ...plot.color,
          key: ds.props[1].key,
          domain: domain,
          range: ["#F4C6A9", "#EA5A55", "#7CD4BE", "#696471"],
        } as any,
        anglePadding: 0,
        innerradius: 55,
        borderColor: {fixedValue: "#00000000"},
        startAngle: 70,
        endAngle: 330
      }),
    );
    dispatch(setSelected({ type: "plot", key: plot.name }));

    const _svg = d3.select("svg#svg");
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }
    dispatch(setColor("#F5F5F5"))
    // dispatch(updatePlot())
    props.setDataset(ds);
    dispatch(toggleMainPanel());
    setStep(3);
  }

  const setupPie = async () => {
    const ds = await loadLocalDs("./2023_movies.csv");

    const circularAxis = newCircularAxis(ds ? ds.props[0].key : "");
    const plot = newPiePlot(circularAxis.id);

    const domain = getRange(ds, ds.props[1].key) ?? [];
    let range = (getRange(ds, ds.props[2].key) ?? []).map((_) => randomColor());
    if (range.length == 2) range[1] = getComplementary(range[0]);

    dispatch(resizeW(plot.radius * 2));
    dispatch(addAces([circularAxis]));
    dispatch(
      addPlot({
        ...plot,
        color: {
          ...plot.color,
          key: ds.props[1].key,
          domain: domain,
          range: ["#9BD2DC", "#EDADB5", "#BFD582", "#BBAA95", "#E87E85"],
        } as any,
        innerradius: 20,
        anglePadding: 8
      }),
    );
    dispatch(setSelected({ type: "plot", key: plot.name }));

    const _svg = d3.select("svg#svg");
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }
    // dispatch(updatePlot())
    props.setDataset(ds);
    dispatch(toggleMainPanel());
    setStep(3);
  };

  const setupSpider = async () => { 
    const ds = await loadLocalDs("./player_stats.csv");

    const plot = newSpiderPlot(ds.props.filter(p => p.type === "continous").slice(0,7));

    dispatch(resizeW(plot.axisLenght*(1 + plot.axisLabelDistance/100)*2));
    dispatch(resizeH(plot.axisLenght*(1 + plot.axisLabelDistance/100)*2));
    dispatch(setColor("#fcfcfc"))
    dispatch(addPlot(plot));
    dispatch(setSelected({ type: "plot", key: plot.name }));

    const _svg = d3.select("svg#svg");
    if (_svg) {
      const W = (_svg as any).node().getBoundingClientRect().width;
      const H = (_svg as any).node().getBoundingClientRect().height;
      console.log(W,H)
      dispatch(show({ width: W, height: H }));
    } else {
      dispatch(show({ width: 0, height: 0 }));
    }

    props.setDataset(ds);
    dispatch(toggleMainPanel());
    setStep(3);
  };

  return (
    <>
      <div
        className={`${step <= 1 ? "" : "hidden"} flex absolute top-0 right-0 left-0 justify-center min-h-full items-center container mx-auto bg-white`}
      >
        <div className="relative p-4 w-full bg-slate-100">
          <div className="relative p-8 pt-16 rounded-md flex flex-col items-center ">
            {step < 0 && (
              <>
                <div className="flex flex-col items-center">
                  <img src="./vite.svg" className="w-[3rem]"></img>
                  <span className="welcomeText underline mt-2">
                    Welcome to QuickCharts
                  </span>
                  <span className="mt-2">
                    Select one of the examples or start from scratch!
                  </span>
                  <div className="flex flex-wrap w-full gap-5 justify-center items-center mt-12 text-sm ">

                      <TemplateButton 
                        onClick={() => setupScatterDemo2()}
                        text="Scatter"
                        img="./chart_demo/scatter.png"
                      />
                      <TemplateButton 
                        onClick={() => setupLine()}
                        text="Line"
                        img="./chart_demo/line.png"
                      />
                      <TemplateButton 
                        onClick={() => setupPie()}
                        text="Pie"
                        img="./chart_demo/pie.png"
                      />
                      <TemplateButton 
                        onClick={() => setupDonutDemo()}
                        text="Donut"
                        img="./chart_demo/donut.png"
                      />
                      <TemplateButton 
                        onClick={() => setupBar()}
                        text="Bar"
                        img="./chart_demo/bar.png"
                      />
                      <TemplateButton 
                        onClick={() => setupSpider()}
                        text="Spider"
                        img="./chart_demo/spider.png"
                      /> 
                      <TemplateButton 
                        onClick={() => setStep(step + 1)}
                        text="Empty canvas"
                        img="./plot_illustrations/empty.png"
                      /> 
                      
                    </div>
                </div>
              </>
            )}

            {step >= 0 && (
              <>
                <Steps
                  size="small"
                  current={step}
                  items={[
                    { title: "Select data" },
                    { title: "Choose plot type" },
                  ]}
                  style={{
                    width: "20rem",
                    margin: "auto",
                    padding: "0rem 0px 4rem 0px",
                  }}
                />
                <div className="flex flex-col gap-2.5 w-[20rem] mx-auto">
                  {step === 0 && (
                    <>
                      <div className="flex flex-col gap-2.5">
                        <button
                          className="text-sm rounded-md"
                          onClick={async () => {
                            props.setDataset(
                              await loadLocalDs("./world_cups.csv"),
                            );
                            setStep(step + 1);
                          }}
                        >
                          Random dataset
                        </button>

                        <button
                          className="text-sm rounded-md"
                          onClick={async () => {
                            setStep(step + 1);
                          }}
                        >
                          No dataset (you can add one later)
                        </button>

                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          // beforeUpload={beforeUpload}
                          onChange={(f) => {
                            onFileInputChange(f);
                            setStep(step + 1);
                          }}
                          style={{ width: "100%" }}
                        >
                          <div className="flex flex-col items-center">
                            {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                            <UploadIcon />
                            <button
                              style={{
                                border: 0,
                                background: "none",
                                paddingTop: ".2rem",
                              }}
                              type="button"
                            >
                              {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
                              {/* <PlusOutlined /> */}
                              <div style={{ marginTop: 8 }}>Upload dataset</div>
                            </button>
                          </div>
                        </Upload>
                      </div>
                    </>
                  )}
                  {step === 1 && (
                    <div className="flex flex-wrap justify-center mt-2 gap-5 text-sm">
                      <div
                        className="demo-box"
                        onClick={() => {
                          dispatch(toggleMainPanel());
                          generatePlot(PlotType.SCATTER);
                          setStep(step + 1);
                        }}
                      >
                        <img src="./plot_illustrations/ScatterPlot.png"></img>
                        <span>Scatter plot</span>
                      </div>
                      <div
                        className="demo-box"
                        onClick={() => {
                          dispatch(toggleMainPanel());
                          generatePlot(PlotType.LINE);
                          setStep(step + 1);
                        }}
                      >
                        <img src="./plot_illustrations/LinePlot.png"></img>
                        <span>Line plot</span>
                      </div>
                      <div
                        className="demo-box"
                        onClick={() => {
                          dispatch(toggleMainPanel());
                          generatePlot(PlotType.PIE);
                          setStep(step + 1);
                        }}
                      >
                        <img src="./plot_illustrations/PiePlot.png"></img>
                        <span>Pie plot</span>
                      </div>
                      <div
                        className="demo-box"
                        onClick={() => {
                          dispatch(toggleMainPanel());
                          generatePlot(PlotType.BAR);
                          setStep(step + 1);
                        }}
                      >
                        <img src="./plot_illustrations/BarPlot.png"></img>
                        <span>Bar plot</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
