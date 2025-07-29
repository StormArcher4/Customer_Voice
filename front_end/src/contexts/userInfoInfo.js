import { createContext } from "react";

export const UserInformationContext = createContext({
  _id: '',           // id from backend
  name: '',
  email: '',
  phone: '',
  satisfaction: '',
  heardAbout: '',
  comments: '',
  createdAt: null,     // date from backend
  setUserInformations: () => {}, // placeholder for setter
});