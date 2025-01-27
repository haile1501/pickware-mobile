import {
  AuthenticationState,
  LoginRequestType,
  User,
} from "@/types/authentication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AsyncStorageConfig } from "@/constants/config";
import { AppDispatch } from "../store";

const initialState: AuthenticationState = {
  loading: false,
  isAuthenticated: false,
  errorMessage: null,
  successMessage: null,
  user: null,
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    // HANDLE REQUEST
    handleRequest: (state) => {
      state.loading = true;
    },
    // HANDLE FAILURE
    handleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

const handleAuthFailure = (error: any, dispatch: AppDispatch) => {
  const errorMessage = error.response
    ? error.response.data.message
    : "Something went wrong";
  dispatch(authenticationSlice.actions.handleFailure(errorMessage));
};

export const login = (loginData: LoginRequestType) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authenticationSlice.actions.handleRequest());
      const result = await axios.post("/auth/log-in", loginData);
      await AsyncStorage.setItem(
        AsyncStorageConfig.accessToken,
        result.data.token
      );
      dispatch(authenticationSlice.actions.loginSuccess(result.data.user));
    } catch (error) {
      handleAuthFailure(error, dispatch);
    }
  };
};

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authenticationSlice.actions.logout());
    await AsyncStorage.removeItem(AsyncStorageConfig.accessToken);
    await AsyncStorage.removeItem(AsyncStorageConfig.refreshToken);
  };
};

export default authenticationSlice.reducer;
