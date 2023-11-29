import { Router, getExpressRouter } from "./framework/router";

import { ObjectId } from "mongodb";
import { AccessList, Material, User, WebSession } from "./app";
import { MaterialDoc } from "./concepts/material";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { AccessLevel, MaterialType } from "./framework/types";

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
    return await User.create(username, password);
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

  // MATERIAL
  @Router.post("/materials")
  async createMaterial(session: WebSessionDoc, name: string, image: string, description: string, ric: string, type: MaterialType) {
    // Verify that the user signed in is an Admin.
    // await AccessList.verifyAccess(await WebSession.getUser(session), AccessLevel.Admin);
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
    return Material.getMaterialByName(name);
  }
  // Search Materials
  @Router.get("/search/material/:query")
  async queryMaterialsByName(query: string) {
    return Material.getMaterialsByQuery({ name: { $regex: `\w*${query}\w*` } });
  }
  @Router.get("/search/ric/:query")
  async queryMaterialsByRIC(query: string) {
    return Material.getMaterialsByQuery({ ric: { $regex: `\w*${query}\w*` } });
  }
}

export default getExpressRouter(new Routes());
