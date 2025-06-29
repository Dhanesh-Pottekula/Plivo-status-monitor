import { combineReducers } from "redux";
import { getUserProfileReducer } from "./user/user.reducers";
import { getTeamMembersListReducer } from "./user/user.reducers";
import { getServiceDetailsReducer, getServicesListReducer, getIncidentsReducer } from "./services.reducer";
import { timelineReducer } from "./timeline.reducer";
import { getOrganizationsReducer, getOrganizationDetailsReducer } from "./organizations.reducer";

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
  //organizations
  getOrganizationsReducer,
  getOrganizationDetailsReducer,
});

export default rootReducer;
  