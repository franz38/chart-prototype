import { Modal } from 'antd';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Dataset } from '../state/dto';


interface DatasetModalProps {
    open: boolean;
    dataset: Dataset | undefined;
    onClose: () => void;
}

export const DatasetModal = (props: DatasetModalProps) => {

    return <Modal
        open={props.open}
        width={600}
        onCancel={() => props.onClose()}
        styles={{
            content: {
                borderColor: "rgb(213, 213, 213)",
                boxShadow: "none",
                padding: "4rem"
            }
        }}
    >
        <DataGrid
            columns={props.dataset?.props.map(p => ({ key: p, name: p })) ?? []}
            rows={props.dataset?.values.map(v => v) ?? []}
        />
    </Modal>
}