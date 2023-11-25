import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { Coordinate } from "../framework/types";
import { NotAllowedError, NotFoundError } from "./errors";

export interface UserSettingsDoc extends BaseDoc {
  user: ObjectId;
  defaultLocation: Coordinate;
}

export default class UserSettingsConcept {
  public readonly userSettings = new DocCollection<UserSettingsDoc>("user-settings");

  async setDefaultLocation(user: ObjectId, defaultLocation: Coordinate) {
    await this.userSettings.createOne({ user, defaultLocation });
    return { msg: `Default location successfully set to ${defaultLocation}!` };
  }

  async getDefaultLocation(user: ObjectId) {
    const settings = await this.userSettings.readOne({ user });
    if (settings) {
      return settings.defaultLocation;
    }
    throw new NotFoundError(`Cannot find default location.`);
  }

  async updateDefaultLocation(user: ObjectId, update: Partial<UserSettingsDoc>) {
    this.sanitizeUpdate(update);
    await this.userSettings.updateOne({ user }, update);
    return { msg: "Settings successfully updated!" };
  }

  private sanitizeUpdate(update: Partial<UserSettingsDoc>) {
    // Make sure the update cannot change the user.
    for (const key in update) {
      if (key === "user") {
        throw new NotAllowedError(`Cannot update user field!`);
      }
    }
  }
}
