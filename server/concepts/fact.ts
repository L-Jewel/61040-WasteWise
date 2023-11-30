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
    const facts_list = [
      "Every year we dump a massive 2.12 billion tons of waste",
      "The recycling rate for cardboard in the U.S. reached a record high of nearly 97% in 2019",
      "One ton of recycled cardboard saves 46 gallons of oil",
      "About 30% of food in American grocery stores is thrown away",
      "The value of the amount of food waste in the U.S. is estimated at more than $161 billion every year",
      "2.5 million plastic bottles are thrown away every hour in America",
      "Recycling plastic takes 88% less energy than making it from raw materials",
      "Enough plastic is thrown away each year to circle the earth four times",
      "Americans use 85 million tons of paper per year which is about 680 pounds per person",
    ];
    for (const text of facts_list) {
      if (await this.facts.readOne({ fact: text })) {
        //
      } else {
        await this.facts.createOne({ fact: text });
      }
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
