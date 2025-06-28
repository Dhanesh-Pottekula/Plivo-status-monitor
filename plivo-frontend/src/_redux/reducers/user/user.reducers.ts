import type { UserActionTypes } from "@/_redux/actions/user.actions";
import { userConstants } from "../../constants/user/user.constants";
import type { TeamMemberInterface, UserInterface, TeamMemberResponse } from "@/_constants/Interfaces/UserInterfaces";

interface UserState {
  type?: string | null;
  message?: string | null;
  error?: string | null;
  profileData?: UserInterface | null;
  isProfileLoading?: boolean;
  teamMembers?: TeamMemberInterface[] | [];
}
const initialState: UserState = {
  type: null,
  message: null,
  error: null,
  teamMembers: [],
  isProfileLoading: false,
  profileData: null,
};


export const getUserProfileReducer = (
  state = initialState,   
  action: UserActionTypes
):UserState => {
  switch (action.type) {
    case userConstants.GET_USER.REQUEST:
      return {
        type: "alert-success",
        message: "Loading...",
        isProfileLoading: true,
      };
        case userConstants.GET_USER.SUCCESS:
      return {
        type: "alert-success",
        message: action.payload as string,
        isProfileLoading: false,
        profileData: action.payload as UserInterface,
      };
    case userConstants.GET_USER.FAILURE:
      return {
        type: "alert-failure",
        error: action.payload  as  null,
        isProfileLoading: false,
        profileData: null,
      };
    default:
      return state;
  }
};

export const getTeamMembersListReducer = (
  state = initialState,   
  action: UserActionTypes
):UserState => {
  switch(action.type){
    case userConstants.GET_TEAM_MEMBERS.REQUEST:
      return {
        type: "alert-success",
        message: "Loading...",
      };
    case userConstants.GET_TEAM_MEMBERS.SUCCESS: {
      const response = action.payload as TeamMemberResponse;
      return {
        type: "alert-success",
        message: response.message,
        teamMembers: response.invite_links,
      };
    }
    case userConstants.GET_TEAM_MEMBERS.FAILURE:
      return {
        type: "alert-failure",
        error: action.payload  as  null,
      };
    default:
      return state;
  }
}