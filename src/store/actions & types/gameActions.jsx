import { ACTIVATE_SUPER_POWERS, SET_LEVEL_LIGHT } from "./gameTypes";

export const lightHard = easyMode => ({
  type: SET_LEVEL_LIGHT,
  payload: easyMode,
});

export const superPowers = usedSuperPowers => ({
  type: ACTIVATE_SUPER_POWERS,
  payload: usedSuperPowers,
});
