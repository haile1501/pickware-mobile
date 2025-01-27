import { combineReducers } from "redux";
// slices
import authenticationReducer from "./slices/authentication";
import batchReducer from "./slices/batch";

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  batch: batchReducer,
});

export default rootReducer;
