import { atom } from "recoil";

export const addPationtForm = atom({
  key: "addPationtForm",
  default: {},
});

export const addPationtImg = atom({
  key: "addPationtImg",
  default: [],
});

export const base64Image = atom({
  key: "base64Image",
  default: [],
});

export const patientsTable = atom({
  key: "patientsTable",
  default: [],
});

export const loginSuccess = atom({
  key: "loginSuccess",
  default: false,
});
