import { combineReducers } from "redux";
import { getUserProfileReducer } from "./user/user.reducers";
import { getTeamMembersListReducer } from "./user/user.reducers";
import { getServicesListReducer } from "./services.reducer";

const rootReducer = combineReducers({
  //auth
  getUserProfileReducer,
  getTeamMembersListReducer,
  getServicesListReducer,
});

export default rootReducer;
  