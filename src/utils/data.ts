import { Dataset } from "../state/dto";
import * as d3 from "d3";

export const getColumn = (dataset: Dataset|undefined, prop: string) => {
  if (!dataset) return []
  return dataset.values.map((row) => row[prop]);
};

export const getRange = (dataset: Dataset|undefined, prop: string) => {
  if (!dataset) return [0,1]
  const column = getColumn(dataset, prop)
  if (typeof column[0] === "number")
    return d3.extent(getColumn(dataset, prop))
  else if (typeof column[0] === "string")
    return [... new Set(column as string[])]
}

export const parseDS = (ds: Dataset): Dataset => {
  ds.values.forEach((row) => {
    Object.keys(row).forEach((k) => {
      row[k] = isNaN(row[k]) ? row[k] : +row[k];
    });
  });

  return { ...ds };
};

export const loadLocalDs = async (localPath: string) => {
  const res = await d3.csv(localPath);
  const ds: Dataset = {
    file: {
      name: "Apple Quality",
      size: 1,
      type: "csv",
    },
    props: [...Object.keys(res[0])],
    values: [
      ...res.map((v) => {
        return v;
      }),
    ],
  };
  return parseDS(ds);
};

export const onFileUpload = async (file: File | undefined) => {
  if (file) {
    try {
      const fileContent = await file.text();
      const data = fileContent.split("\n");
      const header = data[0];
      const csv_props = header.split(",");
      const values = [];

      for (let i = 1; i < data.length - 1; i++) {
        let row = data[i].split(",").reduce((acc, current, id) => {
          const p: string = csv_props[id];
          acc[p] = current;
          return acc;
        }, {} as { [prop: string]: any });
        values.push(row);
      }

      let ds: Dataset = {
        file: { 
          name: file.name,
          size: file.size,
          type: file.type
         },
        props: csv_props,
        values: values,
      };

      return parseDS(ds);
    } catch (error) {
      throw new Error("Error reading the csv file");
    }
  }
  return new Promise<undefined>((res) => res(undefined));
};
