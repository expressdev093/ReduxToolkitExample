import { combineReducers } from "@reduxjs/toolkit";
import postReducer from "./postReducer";
const rootReducer = combineReducers({
  post: postReducer
});

export default rootReducer;
