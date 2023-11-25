import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { AccessLevel } from "../framework/types";
import { NotAllowedError, NotFoundError } from "./errors";

export interface AccessDoc extends BaseDoc {
  user: ObjectId;
  accessLevel: AccessLevel;
}

export default class AccessListConcept {
  public readonly accessList = new DocCollection<AccessDoc>("access-list");

  // Retrieves the access level of `user`.
  async getUserAccess(user: ObjectId) {
    const access = await this.accessList.readOne({ user });
    if (access) {
      return access.accessLevel;
    }
    throw new NotFoundError(`Cannot find user ${user} in the access list.`);
  }

  // Gives access level `accessLevel` to user `user`.
  async setUserAccess(user: ObjectId, accessLevel: AccessLevel) {
    const currentAccess = await this.accessList.readOne({ user });
    // If an access entry already exists, update it. Otherwise, create one.
    if (currentAccess) {
      const accessUpdate = { user, accessLevel };
      await this.accessList.updateOne({ user }, accessUpdate);
    }
    await this.accessList.createOne({ user, accessLevel });
    return { msg: `${user} successfully given ${accessLevel} access!` };
  }

  // Verify that the user's access is at least `accessLevel`.
  async verifyAccess(user: ObjectId, accessLevel: AccessLevel) {
    const userAccess = await this.getUserAccess(user);
    if (userAccess < accessLevel) {
      throw new NotAllowedError(`User doesn't have ${accessLevel} access!`);
    }
  }
}
