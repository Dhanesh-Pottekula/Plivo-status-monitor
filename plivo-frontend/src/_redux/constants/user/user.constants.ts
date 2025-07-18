import type { Error_response_on_api_failure } from "@/_constants/Interfaces/ResponseInterfaces";
import type { UserInterface, SignUpFormData, InviteLinkInterface, TeamMemberResponse } from "@/_constants/Interfaces/UserInterfaces"; 

export interface LoginFormData {
    username: string;
    password: string;
  }

const createAsyncActionTypes = (base: string) => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`,
});

export const userConstants = {
  GET_USER: createAsyncActionTypes("GET_USER"),
  SIGN_UP: createAsyncActionTypes("SIGN_UP"),
  LOGIN: createAsyncActionTypes("LOGIN"),
  GENERATE_INVITE_LINK: createAsyncActionTypes("GENERATE_INVITE_LINK"),
  GET_TEAM_MEMBERS: createAsyncActionTypes("GET_TEAM_MEMBERS"),
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: createAsyncActionTypes("LOGOUT"),
  VERIFY_INVITE_TOKEN: createAsyncActionTypes("VERIFY_INVITE_TOKEN"),
  GRANT_ACCESS: createAsyncActionTypes("GRANT_ACCESS"),
  REVOKE_ACCESS: createAsyncActionTypes("REVOKE_ACCESS"),
};

export type UserActionTypes =
  | { type: typeof userConstants.GET_USER.REQUEST; payload: null }
  | { type: typeof userConstants.GET_USER.SUCCESS; payload: UserInterface }
  | { type: typeof userConstants.GET_USER.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.SIGN_UP.REQUEST; payload: SignUpFormData }
  | { type: typeof userConstants.SIGN_UP.SUCCESS; payload: UserInterface }
  | { type: typeof userConstants.SIGN_UP.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.LOGIN.REQUEST; payload: LoginFormData }
  | { type: typeof userConstants.LOGIN.SUCCESS; payload: UserInterface }
  | { type: typeof userConstants.LOGIN.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.LOGOUT.REQUEST; payload: null }
  | { type: typeof userConstants.LOGOUT.SUCCESS; payload: null }
  | { type: typeof userConstants.LOGOUT.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.VERIFY_INVITE_TOKEN.REQUEST; payload: null }
  | { type: typeof userConstants.VERIFY_INVITE_TOKEN.SUCCESS; payload: InviteLinkInterface }
  | { type: typeof userConstants.VERIFY_INVITE_TOKEN.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.GET_TEAM_MEMBERS.REQUEST; payload: null }
  | { type: typeof userConstants.GET_TEAM_MEMBERS.SUCCESS; payload: TeamMemberResponse }
  | { type: typeof userConstants.GET_TEAM_MEMBERS.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof userConstants.GRANT_ACCESS.REQUEST; payload: null }
  | { type: typeof userConstants.GRANT_ACCESS.SUCCESS; payload: null }
  | { type: typeof userConstants.GRANT_ACCESS.FAILURE; payload: Error_response_on_api_failure | null }
