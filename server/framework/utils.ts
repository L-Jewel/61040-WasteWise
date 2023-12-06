import { BinType } from "./types";

export function getParamNames(f: Function) {
  return f
    .toString()
    .match(/\((.*?)\)/)![1]
    .split(",") // Simple regex to get "name: type" items in signature
    .map((param: string) => param.split("=")[0].trim()); // remove whitespaces
}

export function getScoreNameForBinType(binType: BinType) {
  switch (binType) {
    case BinType.Recycling:
      return "Recycle";

    case BinType.Compost:
      return "Compost";

    case BinType.Trash:
      return "Trash";

    case BinType.Donation:
      return "Donation";
  }
}
