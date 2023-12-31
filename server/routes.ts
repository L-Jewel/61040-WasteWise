import { Router, getExpressRouter } from "./framework/router";

import { ObjectId } from "mongodb";
import { AccessList, Bin, Fact, Map, Material, Score, User, WebSession } from "./app";
import { BinDoc } from "./concepts/bin";
import { BadValuesError, NotFoundError } from "./concepts/errors";
import { MaterialDoc } from "./concepts/material";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { AccessLevel, BinStatus, BinType, MaterialType } from "./framework/types";
import { getScoreNameForBinType, getScoreNameForMaterialType } from "./framework/utils";

class Routes {
  // SESSION
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }
  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }
  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // USER
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    const result = await User.create(username, password);
    // Creates scores for user on startup
    const scoreNames = ["Compost", "Recycle", "Trash", "Donation"];
    if (result && result.user) await Score.createManyScores(result.user._id, scoreNames);
    return result;
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }
  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  // ACCESS
  @Router.get("/access/:username")
  async getAccessLevel(username: string) {
    const user = await User.getUserByUsername(username);
    return await AccessList.getUserAccess(user._id);
  }
  @Router.post("/access")
  async giveAccess(session: WebSessionDoc, username: string, accessLevel: AccessLevel) {
    // Verify that the user signed in is an Admin.
    await AccessList.verifyAccess(await WebSession.getUser(session), AccessLevel.Admin);
    // Give access.
    const user = await User.getUserByUsername(username);
    return await AccessList.setUserAccess(user._id, accessLevel);
  }

  // FACT
  @Router.get("/fact")
  async getRandomFact() {
    return await Fact.getRandomFact();
  }

  // MATERIAL
  @Router.post("/materials")
  async createMaterial(session: WebSessionDoc, name: string, image: string, description: string, ric: string, type: MaterialType) {
    // Verify that the user signed in is an Admin.
    await AccessList.verifyAccess(await WebSession.getUser(session), AccessLevel.Admin);
    // Create material.
    return await Material.createMaterial(name, image, description, ric, type);
  }
  @Router.patch("/materials")
  async updateMaterial(session: WebSessionDoc, _id: ObjectId, update: Partial<MaterialDoc>) {
    // Verify that the user signed in is an Admin.
    await AccessList.verifyAccess(await WebSession.getUser(session), AccessLevel.Admin);
    // Update material.
    return await Material.updateMaterial(_id, update);
  }
  @Router.delete("/materials")
  async deleteMaterial(session: WebSessionDoc, _id: ObjectId) {
    // Verify that the user signed in is an Admin.
    await AccessList.verifyAccess(await WebSession.getUser(session), AccessLevel.Admin);
    // Delete material.
    return await Material.removeMaterial(_id);
  }
  @Router.get("/materials/:name")
  async getMaterial(name: string) {
    return Material.getMaterial(name);
  }
  // Search Materials
  @Router.get("/search/material/:input")
  async queryMaterialsByName(input: string) {
    return Material.getMaterialsByQuery({ name: { $regex: `(?i)\\w*${input}\\w*` } });
  }
  @Router.get("/search/ric/:input")
  async queryMaterialsByRIC(input: string) {
    return Material.getMaterialsByQuery({ ric: { $regex: `(?i)\\w*${input}\\w*` } });
  }

  // BIN
  @Router.post("/bins")
  async addBin(session: WebSessionDoc, type: BinType, acceptedMaterials: ObjectId[], misdisposedMaterials: ObjectId[], location: [number, number]) {
    // Verify that the user signed in is an Organization
    const user = await WebSession.getUser(session);
    await AccessList.verifyAccess(user, AccessLevel.Organization);

    const bin = await Bin.addBin(type, acceptedMaterials, misdisposedMaterials);
    if (bin.bin) {
      return await Map.addBin(bin.bin?._id, location);
    } else {
      throw new BadValuesError("Bin could not be created");
    }
  }
  @Router.patch("/bins/:_id")
  async updateBin(session: WebSessionDoc, _id: ObjectId, update: Partial<BinDoc>) {
    // Verify that the user signed in is an Organization
    const user = await WebSession.getUser(session);
    await AccessList.verifyAccess(user, AccessLevel.Organization);

    return await Bin.updateBin(_id, update);
  }
  @Router.delete("/bins/:_id")
  async deleteBin(session: WebSessionDoc, _id: string) {
    // Verify that the user signed in is an Organization
    const user = await WebSession.getUser(session);
    await AccessList.verifyAccess(user, AccessLevel.Organization);

    await Bin.removeBin(new ObjectId(_id));
    return await Map.removeBin(_id);
  }
  @Router.post("/bins/:_id")
  async reportBinStatus(session: WebSessionDoc, _id: ObjectId, status: BinStatus) {
    // Verify that the user is signed in.
    WebSession.isLoggedIn(session);

    return Bin.setBinStatus(_id, status);
  }
  @Router.get("/bins/:_id")
  async getBinInfo(_id: ObjectId) {
    return await Bin.getBinById(_id);
  }
  // Search Bins
  @Router.get("/search/bins/status/:input")
  async searchBinsByStatus(input: BinStatus) {
    return await Bin.getBinsByQuery({ status: input });
  }
  @Router.get("/search/bins/type/:input")
  async searchBinsByType(input: BinType) {
    return await Bin.getBinsByQuery({ type: input });
  }
  @Router.get("/search/bins/material/:input")
  async searchBinsByMaterial(input: ObjectId) {
    return await Bin.getBinsByQuery({ acceptedMaterials: { $in: [input] } });
  }

  // MAP
  @Router.get("/map")
  async getBinsByLocation(longitude: string, latitude: string, type?: string) {
    const mapMarkers = await Map.getBinsByLocation(longitude, latitude);

    if (type) {
      const binsOfCorrectType = (await Bin.getBinsByQuery({ type: Object.keys(BinType).indexOf(type) })).map((bin) => bin._id.toString());

      return mapMarkers.filter((marker) => binsOfCorrectType.includes(marker.bin.toString()));
    } else {
      return mapMarkers;
    }
  }
  @Router.get("/map/:_id")
  async getBinLocation(_id: string) {
    return await Map.getBinLocation(_id);
  }
  @Router.patch("/map")
  async updateBinLocation(session: WebSessionDoc, _id: string, location: [number, number]) {
    const user = WebSession.getUser(session);
    await AccessList.verifyAccess(user, AccessLevel.Organization);

    return await Map.updateBinLocation(_id, location);
  }

  // Scores
  @Router.get("/scores/:name")
  async getScore(session: WebSessionDoc, name: string) {
    const user = WebSession.getUser(session);
    const score = await Score.getScoreForUser(user, name);
    if (score) return score;
    throw new NotFoundError(`Score ${name} does not exists for user ${user}!`);
  }

  @Router.patch("/scores/:name")
  async incrementScore(session: WebSessionDoc, name: string) {
    const user = WebSession.getUser(session);
    const score = await Score.getScoreForUser(user, name);
    if (!score) throw new NotFoundError(`Score for user ${user} not found!`);
    return await Score.updateScore(score._id, { value: score.value + 1 });
  }

  // Disposal of materials
  @Router.patch("/dispose/material/:materialName")
  async disposeMaterial(session: WebSessionDoc, materialName: string) {
    const user = WebSession.getUser(session);
    const material = await Material.getMaterial(materialName);
    const scoreName = getScoreNameForMaterialType(material.type.toString());
    // can prob make scores have a "bin" or "waste" enum instead of name
    const score = await Score.getScoreForUser(user, scoreName);
    if (!score) throw new NotFoundError(`Score for user ${user} not found!`);
    return await Score.updateScore(score._id, { value: score.value + 1 });
  }

  @Router.patch("/dispose/bin/:binNumber")
  async disposeInBin(session: WebSessionDoc, binNumber: string) {
    const user = WebSession.getUser(session);
    const scoreName = getScoreNameForBinType(binNumber);
    // can prob make scores have a "bin" or "waste" enum instead of name
    const score = await Score.getScoreForUser(user, scoreName);
    if (!score) throw new NotFoundError(`Score for user ${user} not found!`);
    return await Score.updateScore(score._id, { value: score.value + 1 });
  }

  // Dashboard
  @Router.get("/dashboard")
  async getDashboard(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const userInfo = await User.getUserById(user);
    const scores = await Score.getScores({ user });
    // will remove if statement after we refresh the database
    if (scores.length === 0) {
      return { user: userInfo };
    } else {
      return { user: userInfo, scores: scores };
    }
  }

  // @Router.get("/do")
  // async doThing() {
  //   Bin.updateBin();
  // }
}

export default getExpressRouter(new Routes());
