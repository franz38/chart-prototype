import { Button, Flex, Upload, UploadFile } from "antd";
import { LevelsPanel } from "./LevelsPanel";
import { useState } from "react";
import { Dataset } from "../state/dto";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Database,
  Layers3,
  Paperclip,
  UploadIcon,
} from "lucide-react";
import { loadLocalDs, onFileUpload } from "../utils/data";
import { UploadChangeParam } from "antd/es/upload";
import { Section } from "../ui-elements/form/Section";
import { SectionContainer } from "../ui-elements/form/SectionContainer";
import { HR } from "../ui-elements/HR";
import { LayerButton } from "../ui-elements/LayerButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { toggleMainPanelSize } from "../state/layout/layoutSlice";
import { Label } from "../ui-elements/Label";

const iconAttributes = {
  size: 14,
  color: "rgba(0, 0, 0, 0.88)",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "start",
  borderRadius: 0,
  height: "2.5rem",
};
export const MainPanel = (props: {
  datasets: Dataset[];
  datasetSelect: () => void;
  setDataset: (ds: Dataset) => void;
  // visible: boolean;
  onExport: (format: "svg" | "png") => void;
  onGetCode: () => void;
}) => {
  const dispatch = useDispatch();

  const minified = useSelector(
    (state: RootState) => state.layout.mainPanelMinified,
  );
  const visible = useSelector(
    (state: RootState) => state.layout.mainPanelVisible,
  );

  const [sectionSelected, setSectionSelected] = useState<"items" | "data">(
    "items",
  );

  const _loadLocalDs = async () => {
    try {
      const ds = await loadLocalDs("./world_cups.csv");
      props.setDataset(ds);
    } catch (error) {
      throw new Error("Error reading the csv file");
    }
  };

  const onFileInputChange = async (
    info: UploadChangeParam<UploadFile<any>>,
  ) => {
    const ds = await onFileUpload(info.file.originFileObj);
    if (ds) props.setDataset(ds);
  };

  return (
    <>
      <div
        id="default-sidebar"
        className={`fixed top-12 left-0 z-40 h-screen transition-transform ${visible ? "" : "-translate-x-60"} bg-white shadow-2xl`}
        aria-label="Sidebar"
      >
        <div className={`flex-col p-2 ${minified ? "w-14" : "w-60"}`}>
          <div className="pb-2 border-b">
            {!minified && (
              <div className="flex justify-between w-full h-[40px] items-center">
                <div className="flex flex-row justify-evenly w-full grow-1">
                  <div
                    className="flex flex-row items-center cursor-pointer"
                    onClick={() => setSectionSelected("items")}
                  >
                    <Layers3 {...iconAttributes} />
                    <span
                      className={`text-sm font-medium ms-2 ${sectionSelected === "items" ? "underline" : ""}`}
                    >
                      Items
                    </span>
                  </div>
                  <div
                    className="flex flex-row items-center cursor-pointer"
                    onClick={() => setSectionSelected("data")}
                  >
                    <Database {...iconAttributes} />
                    <span
                      className={`text-sm font-medium ms-2 ${sectionSelected === "data" ? "underline" : ""}`}
                    >
                      Data
                    </span>
                  </div>
                </div>
                <div
                  className="flex w-[40px] h-[40px] p-2 items-center justify-center cursor-pointer hover:bg-[#eee]"
                  onClick={() => dispatch(toggleMainPanelSize())}
                >
                  <ArrowLeftFromLine {...iconAttributes} />
                </div>
              </div>
            )}
            {minified && (
              <LayerButton
                minified={minified}
                icon={<ArrowRightFromLine {...iconAttributes} />}
                label={"Expand"}
                padding={0}
                onClick={() => dispatch(toggleMainPanelSize())}
              />
            )}
          </div>
          {sectionSelected == "items" && (
            <LevelsPanel
              onExport={props.onExport}
              onGetCode={props.onGetCode}
              minified={minified}
            />
          )}
          {sectionSelected == "data" && (
            <SectionContainer className={minified ? "" : "pl-2"}>
              <div>
                {!minified && <Label>Datasets list</Label>}
                <div className="flex flex-col w-full">
                  {props.datasets.map((ds, i) => (
                    <LayerButton
                      key={ds.file.name + i}
                      label={ds.file.name}
                      icon={<Paperclip {...iconAttributes} />}
                      onClick={() => props.datasetSelect()}
                      // selected={selected && plot.name === selected.key}
                      padding={0}
                      minified={minified}
                    />
                  ))}
                </div>
              </div>

              <HR />

              <>
                {!minified && (
                  <Section label="Add dataset">
                    <Button
                      style={{ ...buttonStyle }}
                      onClick={() => _loadLocalDs()}
                    >
                      Generate ds
                    </Button>
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
                        <button
                          style={{
                            border: 0,
                            background: "none",
                            paddingTop: ".2rem",
                          }}
                          type="button"
                        >
                          <div style={{ marginTop: 8 }}>Upload dataset</div>
                        </button>
                      </Flex>
                    </Upload>
                  </Section>
                )}
              </>
            </SectionContainer>
          )}
        </div>
      </div>
    </>
  );
};
