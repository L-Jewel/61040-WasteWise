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

  async removeBin(bin: ObjectId) {
    // assert bin exists
    await this.getBinLocation(bin);

    await this.map.deleteOne({ bin });
    return { msg: "Bin successfully deleted!" };
  }

  async updateBinLocation(bin: ObjectId, location: [number, number]) {
    // assert bin exists
    await this.getBinLocation(bin);

    const _id = await this.map.updateOne(
      { bin },
      {
        bin,
        location: location,
      },
    );
    return { msg: "Bin location successfully updated!", binMarker: this.map.readOne({ bin }) };
  }

  // https://www.mongodb.com/docs/manual/reference/operator/query/near/
  // get all bins up to 0.1 radians away from location
  async getBinsByLocation(location: [number, number]) {
    const results = await this.map.readMany({ location: { $near: location, $maxDistance: 0.1 } });
    return results;
  }

  async getBinLocation(bin: ObjectId) {
    const results = await this.map.readOne({ bin });

    if (results) {
      return results.location;
    } else {
      throw new NotFoundError("Bin does not exist on map!");
    }
  }
}
