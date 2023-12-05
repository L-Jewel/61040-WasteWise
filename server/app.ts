import AccessListConcept from "./concepts/accessList";
import BinConcept from "./concepts/bin";
import FactConcept from "./concepts/fact";
import MapConcept from "./concepts/map";
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
export const Bin = new BinConcept();
export const Map = new MapConcept();
