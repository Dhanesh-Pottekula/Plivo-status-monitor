import { combineReducers } from "redux";
import { getUserProfileReducer } from "./user/user.reducers";
import { getTeamMembersListReducer } from "./user/user.reducers";
import { getServiceDetailsReducer, getServicesListReducer, getIncidentsReducer } from "./services.reducer";
import { timelineReducer } from "./timeline.reducer";

const rootReducer = combineReducers({
  //auth
  getUserProfileReducer,
  getTeamMembersListReducer,
  //services
  getServicesListReducer,
  getServiceDetailsReducer,
  getIncidentsReducer,
  //timeline
  timelineReducer,
});

export default rootReducer;
  