import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ScoreDoc extends BaseDoc {
  name: string;
  value: number;
  user: ObjectId;
}

export default class ScoreConcept {
  public readonly scores = new DocCollection<ScoreDoc>("scores");

  async getScores(query: Filter<ScoreDoc>) {
    const scores = this.scores.readMany(query);
    return scores;
  }

  async getScoreForUser(user: ObjectId, name: string) {
    const score = this.scores.readOne({ name, user });
    if (score) {
      return score;
    }
    throw new NotFoundError("Score does not exist!");
  }

  async createManyScores(user: ObjectId, names: string[], initVal?: number) {
    if (initVal === undefined) initVal = 0;
    const scores: ObjectId[] = [];
    for (const name of names) {
      const _id = await this.scores.createOne({
        name,
        value: initVal,
        user,
      });
      scores.push(_id);
    }
    return { msg: "Scores successfully created!", score: await this.scores.readMany({ scores }) };
  }

  async createScore(user: ObjectId, name: string, initVal?: number) {
    await this.isNameUniqueForUser(name, user);
    if (initVal === undefined) initVal = 0;
    const _id = await this.scores.createOne({
      name,
      value: initVal,
      user,
    });
    return { msg: "Score successfully created!", score: await this.scores.readOne({ _id }) };
  }

  async updateScore(_id: ObjectId, update: Partial<ScoreDoc>) {
    this.sanitizeUpdate(update);
    const score = await this.scores.readOne({ _id });
    if (!score) throw new NotFoundError("Score does not exist!");

    if (update.name) await this.isNameUniqueForUser(update.name, score.user);
    await this.scores.updateOne({ _id }, update);
    return { msg: "Score successfully updated!", score: await this.scores.readOne({ _id }) };
  }

  private async isNameUniqueForUser(name: string, user: ObjectId) {
    if (await this.scores.readOne({ name, user })) {
      throw new NotAllowedError(`User ${user} already has score with name ${name}!`);
    }
  }

  private sanitizeUpdate(update: Partial<ScoreDoc>) {
    // Make sure the update cannot change the user.
    const allowedUpdates = ["name", "value"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}
