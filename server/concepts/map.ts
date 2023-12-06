import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface MapDoc extends BaseDoc {
  bin: ObjectId;
  location: [number, number]; // [<longitude>, <latitude>] or just [x,y]
}

export default class MapConcept {
  public readonly map = new DocCollection<MapDoc>("map");

  async addBin(bin: ObjectId, location: [number, number]) {
    const _id = await this.map.createOne({
      bin,
      location,
    });
    return { msg: "Bin successfully created!", binMarker: await this.map.readOne({ _id }) };
  }

  async removeBin(bin: string) {
    // assert bin exists
    await this.getBinLocation(bin);

    await this.map.deleteOne({ bin: new ObjectId(bin) });
    return { msg: "Bin successfully deleted!" };
  }

  async updateBinLocation(bin: string, location: [number, number]) {
    // assert bin exists
    await this.getBinLocation(bin);

    const _id = await this.map.updateOne(
      { bin: new ObjectId(bin) },
      {
        bin: new ObjectId(bin),
        location: location,
      },
    );
    return { msg: "Bin location successfully updated!" };
  }

  // https://www.mongodb.com/docs/manual/reference/operator/query/near/
  // get all bins up to 0.1 radians away from location
  async getBinsByLocation(longitude: string, latitude: string) {
    const bins = await this.map.readMany({});

    // filter results to be a 2x2 square centered at longitude, latitude
    const filteredBins = bins.filter((bin) => Math.abs(bin.location[0] - parseFloat(longitude)) <= 1 && Math.abs(bin.location[1] - parseFloat(latitude)) <= 1);
    return filteredBins;
  }

  async getBinLocation(bin: string) {
    console.log(bin);
    const results = await this.map.readOne({ bin: new ObjectId(bin) });

    if (results) {
      return results.location;
    } else {
      throw new NotFoundError("Bin does not exist on map!");
    }
  }
}
