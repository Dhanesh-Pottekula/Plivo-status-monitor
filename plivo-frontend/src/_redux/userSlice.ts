import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { apiUrls } from "../config/apiUrls";
import axiosNodeInstance from "@/config/axios.config";
import type { SignUpFormData, UserInterface, InviteLinkInterface } from "@/_constants/Interfaces/UserInterfaces";




interface InitialState {
  isLoading: boolean;
  user: UserInterface | null;
  error: string | null;
}
export interface LoginFormData {
  username: string;
  password: string;
}
const initialState: InitialState = {
  isLoading: false,
  user: null,
  error: null,
}

// Async Thunks
export const getUser = createAsyncThunk<UserInterface>(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosNodeInstance.get(apiUrls.auth.getUser);
      return res.data.user;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const signUp = createAsyncThunk<UserInterface, SignUpFormData>(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosNodeInstance.post(apiUrls.auth.signUp, data);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(error);  
    }
  }
);

export const login = createAsyncThunk<UserInterface, LoginFormData>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosNodeInstance.post(apiUrls.auth.login, data);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const generateInviteLink = createAsyncThunk<InviteLinkInterface, {username: string}>(
  "auth/generateInviteLink",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosNodeInstance.post(apiUrls.auth.generateInviteLink, data);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);  

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("streetdine-customer");
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<UserInterface>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Generate Invite Link
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
