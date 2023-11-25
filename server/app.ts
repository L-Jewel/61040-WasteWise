import AccessListConcept from "./concepts/accessList";
import UserConcept from "./concepts/user";
import UserSettingsConcept from "./concepts/userSettings";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const AccessList = new AccessListConcept();
export const UserSettings = new UserSettingsConcept();
