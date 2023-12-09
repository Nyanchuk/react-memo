import { ACTIVATE_SUPER_POWERS, SET_LEVEL_LIGHT } from "../actions & types/gameTypes";

const initialState = {
  easyMode: false,
  usedSuperPowers: false,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LEVEL_LIGHT:
      return { ...state, easyMode: action.payload };
    case ACTIVATE_SUPER_POWERS:
      return { ...state, usedSuperPowers: true };
    default:
      return state;
  }
}
