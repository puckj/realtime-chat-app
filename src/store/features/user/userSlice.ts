import AsyncStorage from "@react-native-async-storage/async-storage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import jwt_decode from "jwt-decode";

const initialState: UserState = {
  isAuthenticated: false,
  authToken: null,
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { authToken } = action.payload;
      const decodedToken: any = jwt_decode(authToken);
      state.isAuthenticated = true;
      state.authToken = authToken;
      state.userId = decodedToken.userId;
      AsyncStorage.setItem("authToken", authToken);
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.authToken = null;
      state.userId = null;
      AsyncStorage.removeItem("authToken");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectIsAuthenticated = (state: RootState) => {
  return state.user.isAuthenticated;
};

export const selectUser = (state: RootState) => {
  return {
    authToken: state.user.authToken,
    userId: state.user.userId,
  };
};

export default userSlice.reducer;
