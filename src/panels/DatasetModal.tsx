import "react-data-grid/lib/styles.css";
import { Dataset } from "../state/dto";
import {
  AlignLeft,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  X,
} from "lucide-react";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { iconAttributes } from "./LevelsPanel";

interface DatasetModalProps {
  state: "hidden" | "small-padding" | "large-padding";
  dataset: Dataset | undefined;
  onClose: () => void;
}

const buildColumns = (dataset?: Dataset): ColumnDef<any, any>[] => {
  if (!dataset) return [];
  return dataset.props.map((prop) => {
    return {
      id: prop.key,
      accessorKey: prop.key,
      header: prop.key,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    };
  });
};

export const DatasetModal = (props: DatasetModalProps) => {
  const [sorting, setSorting] = useState<SortingState>();

  const handleHeaderClick = (columnId: string) => {
    if (sorting?.[0]?.id === columnId) {
      setSorting([
        {
          id: columnId,
          desc: !sorting[0].desc,
        },
      ]);
    } else {
      setSorting([
        {
          id: columnId,
          desc: false,
        },
      ]);
    }
  };

  const table = useReactTable({
    data: props.dataset?.values ?? [],
    columns: buildColumns(props.dataset),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div
        className={`fixed top-12 left-0 z-30 h-screen bg-white shadow-2xl ${props.state == "hidden" ? "hidden" : props.state == "large-padding" ? "w-[60rem] translate-x-60" : "w-[60rem] translate-x-14"}`}
      >
        <div className="flex flex-col mx-8 py-2 h-screen overflow-y-scroll pb-32">
          <div className="flex flex-row items-center block h-[48px] pb-2 shrink-0">
            <div
              className="flex w-[40px] h-[40px] p-2 items-center justify-center cursor-pointer hover:bg-[#eee]"
              onClick={() => props.onClose()}
            >
              <X
                className=""
                onClick={() => props.onClose()}
                {...iconAttributes}
              ></X>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-[22px] leading-[22px] px-2 py-[5px] text-sm font-medium  border border-[rgb(233, 233, 231)]"
                      style={{ color: "rgba(55, 53, 47, 0.65)" }}
                    >
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        onClick={() => handleHeaderClick(header.id)}
                      >
                        {!(sorting?.[0]?.id === header.id) && (
                          <AlignLeft size={14} className="mr-2" />
                        )}
                        {sorting?.[0]?.id === header.id && (
                          <>
                            {!sorting?.[0]?.desc && (
                              <ArrowDownNarrowWide size={14} className="mr-2" />
                            )}
                            {sorting?.[0]?.desc && (
                              <ArrowUpWideNarrow size={14} className="mr-2" />
                            )}
                          </>
                        )}
                        <span className="truncate">{header.id}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="h-[22px] leading-[22px] px-2 py-[5px] text-sm border border-[rgb(233, 233, 231)] truncate"
                      style={{ color: "rgb(55, 53, 47)" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
