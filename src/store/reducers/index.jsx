import { combineReducers } from "redux";
import gameReducer from "./gameReducers";

const rootReducer = combineReducers({
  game: gameReducer,
});

export default rootReducer;
