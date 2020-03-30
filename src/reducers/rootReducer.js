import { combineReducers } from "redux";
import GameReducer from "./gameReducer.js";

const rootReducer = combineReducers({
    game: GameReducer
})

export default rootReducer;