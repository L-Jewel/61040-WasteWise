import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface FactDoc extends BaseDoc {
  fact: string;
}

export default class FactConcept {
  public readonly facts = new DocCollection<FactDoc>("facts");

  async getFactsByQuery(query: Filter<FactDoc>) {
    const results = this.facts.readMany(query);
    return results;
  }

  async getFactById(_id: ObjectId) {
    const fact = await this.facts.readOne({ _id });
    if (fact) {
      return fact;
    }
    throw new NotFoundError(`Fact does not exist!`);
  }

  async getRandomFact() {
    const facts_list = ["Glass is 100% recyclable and can be recycled endlessly without loss in quality or purity"];
    for (const text of facts_list) {
      await this.facts.createOne({ fact: text });
    }
    const fact_list = await this.getFactsByQuery({});
    if (fact_list.length == 0) {
      throw new NotFoundError(`Fact database is currently empty!`);
    }
    const rand_index = Math.floor(Math.random() * fact_list.length);
    return fact_list[rand_index];
  }

  //async createFact(fact: string) {
  //  await this.isFactUnique(fact);
  //  const _id = await this.facts.createOne({ fact });
  //  return { msg: "Fact successfully created!", fact: await this.facts.readOne({ _id }) };
  //}

  //async removeFact(_id: ObjectId) {
  //  await this.facts.deleteOne({ _id });
  //  return { msg: "Fact deleted successfully!" };
  //}

  //async clearFacts() {
  //  await this.facts.deleteMany({});
  //  return { msg: "All facts deleted successfully!" };
  //}

  //private async isFactUnique(fact: string) {
  //  if (await this.facts.readOne({ fact })) {
  //    throw new NotAllowedError(`Fact with name ${fact} already exists!`);
  //  }
  //}
}
