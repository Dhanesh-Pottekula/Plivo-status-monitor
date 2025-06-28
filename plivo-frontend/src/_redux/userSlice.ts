import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { apiUrls } from "../config/apiUrls";
import axiosNodeInstance from "@/config/axios.config";
import type { SignUpFormData, UserInterface, InviteLinkInterface, TeamMemberInterface, TeamMemberResponse } from "@/_constants/Interfaces/UserInterfaces";




interface InitialState {
  isLoading: boolean;
  user: UserInterface | null;
  error: string | null;
  teamMembers: TeamMemberInterface[] | [];
}
export interface LoginFormData {
  username: string;
  password: string;
}
const initialState: InitialState = {
  isLoading: false,
  user: null,
  error: null,
  teamMembers: [],
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

export const getTeamMembers = createAsyncThunk<TeamMemberResponse, void>(
  "auth/getTeamMembers",
  async () => {
      const res = await axiosNodeInstance.get(apiUrls.auth.getTeamMembers);
      return res.data;
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

      // Get User
      builder.addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      builder.addCase(getUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      builder.addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Sign Up
      builder.addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      builder.addCase(signUp.fulfilled, (state, action: PayloadAction<UserInterface>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      builder.addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //  get team members
  
      builder.addCase(getTeamMembers.fulfilled, (state, action: PayloadAction<TeamMemberResponse>) => {
        state.isLoading = false;  
        state.teamMembers = action.payload.invite_links;
      })

      // Generate Invite Link
      builder.addCase(generateInviteLink.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(generateInviteLink.fulfilled, (state) => {
        state.isLoading = false;
      });
      builder.addCase(generateInviteLink.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
