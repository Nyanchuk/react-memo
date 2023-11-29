import { SET_LEVEL_LIGHT } from "./gameTypes";

export const lightHard = easyMode => ({
  type: SET_LEVEL_LIGHT,
  payload: easyMode,
});
