import { combineReducers } from "redux";
import { getUserProfileReducer } from "./user/user.reducers";
import { getTeamMembersListReducer } from "./user/user.reducers";
import { getServiceDetailsReducer, getServicesListReducer, getIncidentsReducer } from "./services.reducer";

const rootReducer = combineReducers({
  //auth
  getUserProfileReducer,
  getTeamMembersListReducer,
  //services
  getServicesListReducer,
  getServiceDetailsReducer,
  getIncidentsReducer,
});

export default rootReducer;
  