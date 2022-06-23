import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk, RootState } from "./../../app/store";

export interface AuthError {
  message: string;
}

export interface AuthState {
  isAuth: boolean;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: AuthError;
}

export interface CurrentUser {
  id: string;
  display_name: string;
  email: string;
  photo_url: string;
}

export const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  error: { message: "An Error occurred" }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAuthSccess: (state, { payload }: PayloadAction<CurrentUser>) => {
      state.currentUser = payload;
      state.isAuth = true;
    },
    setLogOut: (state) => {
      state.isAuth = false;
      state.currentUser = undefined;
    },
    setAuthFailed: (state, { payload }: PayloadAction<AuthError>) => {
      state.error = payload;
      state.isAuth = false;
    }
  }
});

export const {
  setAuthSccess,
  setLogOut,
  setLoading,
  setAuthFailed
} = authSlice.actions;

export const login = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentUser = getCurrentUserFromAPI(
      "https://auth-end-point.com/login"
    );
    dispatch(setAuthSccess(currentUser));
  } catch (error) {
    dispatch(setAuthFailed(error as AuthError));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logOut = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await endUserSession("https://auth-end-point.com/log-out");
  } catch (error) {
    dispatch(setAuthFailed(error));
  } finally {
    dispatch(setLoading(false));
  }
};
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
