import { SET_LEVEL_LIGHT } from "../actions & types/gameTypes";

const initialState = {
  easyMode: false,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LEVEL_LIGHT:
      return { ...state, easyMode: action.payload };
    default:
      return state;
  }
}
