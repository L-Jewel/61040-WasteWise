import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { AccessLevel } from "../framework/types";
import { NotFoundError } from "./errors";

export interface AccessDoc extends BaseDoc {
  user: ObjectId;
  accessLevel: AccessLevel;
}

export default class AccessListConcept {
  public readonly accessList = new DocCollection<AccessDoc>("access-list");

  // Retrieves the access level of `user`.
  async getAccess(user: ObjectId) {
    const access = await this.accessList.readOne({ user });
    if (access) {
      return access.accessLevel;
    }
    throw new NotFoundError(`Cannot find user ${user} in the access list.`);
  }

  // Update the access level of `user` to `newAccess`.
  async updateUserAccess(user: ObjectId, newAccess: AccessLevel) {
    const accessUpdate = {
      user,
      accessLevel: newAccess,
    };
    await this.accessList.updateOne({ user }, accessUpdate);
    return { msg: `${user}'s access level successfully changed to ${newAccess}!` };
  }

  // Gives access level `accessLevel` to user `user`.
  async giveAccess(user: ObjectId, accessLevel: AccessLevel) {
    await this.accessList.createOne({ user, accessLevel });
    return { msg: `${user} successfully given ${accessLevel} access!` };
  }
}
