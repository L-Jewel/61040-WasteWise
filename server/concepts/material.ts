import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { MaterialType } from "../framework/types";
import { NotAllowedError, NotFoundError } from "./errors";

export interface MaterialDoc extends BaseDoc {
  name: string;
  image: string;
  description: string;
  ric: string;
  type: MaterialType;
}

export default class MaterialConcept {
  public readonly materials = new DocCollection<MaterialDoc>("materials");

  async getMaterialsByQuery(query: Filter<MaterialDoc>) {
    const results = this.materials.readMany(query);
    return results;
  }

  async getMaterialByName(name: string) {
    const material = await this.materials.readOne({ name });
    if (material) {
      return material;
    }
    throw new NotFoundError(`Material does not exist!`);
  }

  async createMaterial(name: string, image: string, description: string, ric: string, type: MaterialType) {
    await this.isNameUnique(name);
    const _id = await this.materials.createOne({
      name,
      image,
      description,
      ric,
      type,
    });
    return { msg: "Material successfully created!", material: await this.materials.readOne({ _id }) };
  }

  async removeMaterial(_id: ObjectId) {
    await this.materials.deleteOne({ _id });
    return { msg: "Material deleted successfully!" };
  }

  async updateMaterial(_id: ObjectId, update: Partial<MaterialDoc>) {
    if (update.name) await this.isNameUnique(update.name);
    await this.materials.updateOne({ _id }, update);
    return { msg: "Material successfully updated!", material: await this.materials.readOne({ _id }) };
  }

  private async isNameUnique(name: string) {
    if (await this.materials.readOne({ name })) {
      throw new NotAllowedError(`Material with name ${name} already exists!`);
    }
  }
}
