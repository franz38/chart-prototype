import { useState } from "react";
import { Plot, isBar, isLine, isPie, isScatter } from "../state/plots/dto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setSelected } from "../state/selected/selectedSlice";
import {
  Move3D,
  Box,
  ScatterChart,
  LineChart,
  PieChart,
  HelpCircle,
  BarChart3,
  MoreVertical,
  Clipboard,
  Image,
  Shapes,
} from "lucide-react";
import { AxisType } from "../state/aces/dto";
import { LayerButton } from "../ui-elements/LayerButton";

export const iconAttributes = {
  size: 14,
  color: "rgba(0, 0, 0, 0.88)",
};

const getPlotIcon = (plot: Plot) => {
  if (isScatter(plot))
    return <ScatterChart {...iconAttributes} />;
  else if (isLine(plot))
    return <LineChart {...iconAttributes} />;
  else if (isPie(plot))
    return <PieChart {...iconAttributes} />;
  else if (isBar(plot))
    return <BarChart3 {...iconAttributes} />;

  return <HelpCircle {...iconAttributes} />;
};

export const LevelsPanel = (props: {
  onExport: (format: "svg" | "png") => void;
  onGetCode: () => void;
  minified: boolean;
}) => {
  const dispatch = useDispatch();
  const plots = useSelector((state: RootState) => state.plots);
  const selected = useSelector((state: RootState) => state.selection.selection);
  const aces = useSelector((state: RootState) => state.aces);

  const [subMenu, setSubMenu] = useState<boolean>(false);

  return (
    <div className="flex flex-col pt-2 select-none gap-1">
      {!props.minified && (
        <div
          className={`${selected && selected.type === "chart" ? "bg-[#eee]" : ""} w-full flex flex-row justify-between px-4 py-2 h-[40px] items-center hover:bg-[#eee] cursor-pointer rounded-sm`}
          onClick={(_e) => {
            dispatch(setSelected({ type: "chart", key: "chart.name" }));
          }}
        >
          <div className="flex items-center">
            <Box {...iconAttributes} className="me-2" />
            <span className="text-sm">Chart</span>
          </div>
          {true && (
            <MoreVertical
              {...iconAttributes}
              className="h-[30px] w-[30px] p-[7px] border border-[transparent] hover:border-[#ccc]"
              onClick={(e) => {
                e.stopPropagation();
                setSubMenu(!subMenu);
              }}
            />
          )}

          <div
            className={`${subMenu ? "" : "hidden"} absolute left-full bg-white ms-2 p-1 w-[160px]`}
            onMouseLeave={() => setSubMenu(false)}
          >
            {false && (
              <div
                className="flex flex-row justify-start items-center px-4 py-2 h-[40px] w-full hover:bg-[#eee] cursor-pointer rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onGetCode();
                }}
              >
                <Clipboard {...iconAttributes} className="me-2" />
                <span className="text-sm">Copy code</span>
              </div>
            )}
            <div
              className="flex flex-row justify-start items-center px-4 py-2 h-[40px] w-full hover:bg-[#eee] cursor-pointer rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                props.onExport("svg");
              }}
            >
              <Shapes {...iconAttributes} className="me-2" />
              <span className="text-sm">Export svg</span>
            </div>
            <div
              className="flex flex-row justify-start items-center px-4 py-2 h-[40px] w-full hover:bg-[#eee] cursor-pointer rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                props.onExport("png");
              }}
            >
              <Image {...iconAttributes} className="me-2" />
              <span className="text-sm">Export png</span>
            </div>
          </div>
        </div>
      )}

      {props.minified && (
        <LayerButton
          label="Chart"
          icon={<Box {...iconAttributes} />}
          onClick={() =>
            dispatch(setSelected({ type: "chart", key: "chart.name" }))
          }
          selected={selected && selected.type === "chart"}
          padding={0}
          minified={props.minified}
        />
      )}

      {plots.map((plot) => (
        <LayerButton
          key={plot.type}
          label={plot.label ?? plot.name}
          icon={getPlotIcon(plot)}
          onClick={() =>
            dispatch(setSelected({ type: "plot", key: plot.name }))
          }
          selected={selected && plot.name === selected.key}
          padding={1}
          minified={props.minified}
        />
      ))}
      {aces
        .filter((ax) => ax.type === AxisType.Linear)
        .map((axis) => (
          <LayerButton
            key={axis.id}
            label={axis.id}
            icon={<Move3D {...iconAttributes} />}
            onClick={() =>
              dispatch(setSelected({ type: "axis", key: axis.id }))
            }
            selected={selected && axis.id == selected.key}
            padding={1}
            minified={props.minified}
          />
        ))}
    </div>
  );
};
