import { combineReducers } from "redux";
import { getUserProfileReducer } from "./user/user.reducers";
import { getTeamMembersListReducer } from "./user/user.reducers";

const rootReducer = combineReducers({
  //auth
  getUserProfileReducer,
  getTeamMembersListReducer,

});

export default rootReducer;
  