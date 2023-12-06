import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BinStatus, BinType } from "../framework/types";

export interface BinDoc extends BaseDoc {
  type: BinType;
  acceptedMaterials: ObjectId[];
  misdisposedMaterials: ObjectId[];
  status?: BinStatus;
  lastStatusUpdate?: Date;
}

export default class BinConcept {
  public readonly bins = new DocCollection<BinDoc>("bins");

  // Basic add/update/delete functions
  async addBin(type: BinType, acceptedMaterials: ObjectId[], misdisposedMaterials: ObjectId[]) {
    const _id = await this.bins.createOne({
      type,
      acceptedMaterials,
      misdisposedMaterials,
    });
    return { msg: "Bin successfully created!", bin: await this.bins.readOne({ _id }) };
  }
  async updateBin(_id: ObjectId, update: Partial<BinDoc>) {
    await this.bins.updateOne({ _id }, update);
    return { msg: "Bin successfully updated!", bin: this.bins.readOne({ _id }) };
  }
  async removeBin(_id: ObjectId) {
    await this.bins.deleteOne({ _id });
    return { msg: "Bin deleted successfully!" };
  }

  async setBinStatus(_id: ObjectId, status: BinStatus) {
    await this.bins.updateOne(
      { _id },
      {
        status,
        lastStatusUpdate: new Date(),
      },
    );
    return { msg: "Bin status updated successfully!", bin: this.bins.readOne({ _id }) };
  }

  // Querying the database
  async getBinsByQuery(query: Filter<BinDoc>) {
    const results = this.bins.readMany(query);
    return results;
  }

  async isAcceptedMaterial(material: ObjectId, _id: ObjectId) {
    const bin = await this.bins.readOne({
      _id,
      acceptedMaterials: material,
    });
    return bin ? true : false;
  }
}
