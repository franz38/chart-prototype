import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Dataset } from "../state/dto";
import { Modal } from "../ui-elements/Modal";
import { X } from "lucide-react";

interface DatasetModalProps {
  open: boolean;
  dataset: Dataset | undefined;
  onClose: () => void;
}

export const DatasetModal = (props: DatasetModalProps) => {
  return (
    <Modal open={props.open}>
      <div className="flex flex-col items-end w-full pb-4">
        <X
          className="cursor-pointer p-1 h-10"
          onClick={() => props.onClose()}
        />
      </div>
      <DataGrid
        columns={
          props.dataset?.props
            .map((v) => v.key)
            .map((p) => ({ key: p, name: p })) ?? []
        }
        rows={props.dataset?.values.map((v) => v) ?? []}
      />
    </Modal>
  );
};
