import type { Dispatch } from 'redux';
import axiosNodeInstance from '@/config/axios.config';
import { apiUrls } from '@/config/apiUrls';
import { userConstants } from '../constants/user/user.constants';
import type { SignUpFormData } from '@/_constants/Interfaces/UserInterfaces';
import { handleError } from '@/_helpers/commonFunctions';

// Action Types
export interface UserActionTypes {
  type: string;
  payload?: unknown;
}


// Get User Action
export const getUserAction = () => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.GET_USER.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(apiUrls.auth.getUser);
    dispatch({
      type: userConstants.GET_USER.SUCCESS,
      payload: response.data.user,
    });
    return response.data.user;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.GET_USER.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Sign Up Action
export const signUpAction = (data: SignUpFormData) => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.SIGN_UP.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.auth.signUp, data);
    dispatch({
      type: userConstants.SIGN_UP.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.SIGN_UP.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Login Action
export const loginAction = (data: { username: string; password: string }) => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.LOGIN.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.auth.login, data);
    dispatch({
      type: userConstants.LOGIN.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.LOGIN.FAILURE,
      payload: errorMessage,
    });

    throw error;
  }
};

// Generate Invite Link Action
export const generateInviteLinkAction = (data: { username: string }) => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.GENERATE_INVITE_LINK.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.auth.generateInviteLink, data);
    dispatch({
      type: userConstants.GENERATE_INVITE_LINK.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.GENERATE_INVITE_LINK.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Get Team Members Action
export const getTeamMembersAction = () => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.GET_TEAM_MEMBERS.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(apiUrls.auth.getTeamMembers);
    dispatch({
      type: userConstants.GET_TEAM_MEMBERS.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.GET_TEAM_MEMBERS.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
// Get Team Members Action
export const logoutAction = () => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.LOGOUT.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.auth.logout);
    dispatch({
      type: userConstants.LOGOUT.SUCCESS,
    });
    dispatch({
      type: userConstants.GET_USER.FAILURE
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.LOGOUT.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Verify Invite Token Action

export const verifyInviteTokenAction = (token: string) => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.VERIFY_INVITE_TOKEN.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(`${apiUrls.auth.verifyInviteToken}${token}`);
    dispatch({
      type: userConstants.VERIFY_INVITE_TOKEN.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.VERIFY_INVITE_TOKEN.FAILURE,
      payload: errorMessage,
    });
    return errorMessage;
  }
};

// Grant Access Action
export const updateUserAccessAction = (data: { user_id: string, has_access: boolean }) => async (dispatch: Dispatch<UserActionTypes>) => {
  dispatch({
    type: userConstants.GRANT_ACCESS.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.auth.grantAccess, data);
    dispatch({
      type: userConstants.GRANT_ACCESS.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: userConstants.GRANT_ACCESS.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
