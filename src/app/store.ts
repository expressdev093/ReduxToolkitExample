import { configureStore, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { ThunkAction } from "redux-thunk";
import logger from "redux-logger";

import rootReducer from "./rootReducer";

const middleware = [...getDefaultMiddleware(), logger];
export const store = configureStore({
  reducer: rootReducer,
  middleware
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
