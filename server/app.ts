import AccessListConcept from "./concepts/accessList";
import FactConcept from "./concepts/fact";
import MaterialConcept from "./concepts/material";
import UserConcept from "./concepts/user";
import UserSettingsConcept from "./concepts/userSettings";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const AccessList = new AccessListConcept();
export const UserSettings = new UserSettingsConcept();
export const Material = new MaterialConcept();
export const Fact = new FactConcept();
