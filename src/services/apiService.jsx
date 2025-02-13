import * as httpRequest from "./httpRequest";

export const checkSemesterSlash = (semester) => {
  return semester.replace("/", "");
};

export const getSemester = async () => {
  try {
    const res = await httpRequest.get("/semesterliste");
    return res;
  } catch (error) {
    return error;
  }
};

export const getUser = async (uid) => {
  try {
    const res = await httpRequest.get(`/swbenutzer?Benutzerlogin=${uid}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getModulListe = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swmodulListe`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getLvListe = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swlvListe`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getGebuchteTermine = async (semester, benutzerId) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swWunschtermine/${benutzerId}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const postNewTerminListe = async (semester, terminListe, benutzerId) => {
  try {
    const res = await httpRequest.post(`${checkSemesterSlash(semester)}/swWunschtermine/${benutzerId}`, terminListe);
    return res;
  } catch (err) {
    return err;
  }
};

export const putTermin = async (semester, termin, benutzerId) => {
  try {
    const res = await httpRequest.put(`${checkSemesterSlash(semester)}/swWunschtermine/${benutzerId}`, termin);
    return res;
  } catch (err) {
    return err;
  }
};

export const postSwZugang = async (semester, zugangscode) => {
  try {
    const res = await httpRequest.post(`${checkSemesterSlash(semester)}/swZugang`, zugangscode);
    return res;
  } catch (err) {
    return err;
  }
};

export const getFeiertage = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/feiertage`);
    return res;
  } catch (error) {
    return error;
  }
};
