export function getParamNames(f: Function) {
  return f
    .toString()
    .match(/\((.*?)\)/)![1]
    .split(",") // Simple regex to get "name: type" items in signature
    .map((param: string) => param.split("=")[0].trim()); // remove whitespaces
}

export function getScoreNameForMaterialType(materialType: string) {
  switch (materialType) {
    case "Recyclable":
      return "Recycle";

    case "Compostable":
      return "Compost";

    case "SolidWaste":
      return "Trash";

    case "Donatable":
      return "Donation";
  }
  throw new Error("Material type not found!");
}
