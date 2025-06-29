import type { OrganizationActionTypes } from "../constants/organization.constants";
import { organizationConstants } from "../constants/organization.constants";
import type { OrganizationDetailsResponse, OrganizationInterface, OrganizationsResponse } from "@/_constants/Interfaces/OrganizationInterfaces";

interface OrganizationState {
  type?: string | null;
  message?: string | null;
  error?: string | null;
  organizations?: OrganizationInterface[] | [];
  currentOrganization?: OrganizationInterface | null;
  isLoading?: boolean;
  isDetailsLoading?: boolean;
}

const initialState: OrganizationState = {
  type: null,
  message: null,
  error: null,
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  isDetailsLoading: false,
};

export const getOrganizationsReducer = (
  state = initialState,   
  action: OrganizationActionTypes
): OrganizationState => {
  switch (action.type) {
    case organizationConstants.GET_ORGANIZATIONS.REQUEST:
      return {
        ...state,
        type: "alert-success",
        message: "Loading organizations...",
        isLoading: true,
        error: null,
      };
    case organizationConstants.GET_ORGANIZATIONS.SUCCESS:
      return {
        ...state,
        type: "alert-success",
        message: "Organizations loaded successfully",
        isLoading: false,
        organizations: (action.payload as OrganizationsResponse).organizations || [],
        error: null,
      };
    case organizationConstants.GET_ORGANIZATIONS.FAILURE:
      return {
        ...state,
        type: "alert-failure",
        isLoading: false,
        organizations: [] as OrganizationInterface[],
      };
    default:
      return state;
  }
};

export const getOrganizationDetailsReducer = (
  state = initialState,   
  action: OrganizationActionTypes
): OrganizationState => {
  switch (action.type) {
    case organizationConstants.GET_ORGANIZATION_DETAILS.REQUEST:
      return {
        ...state,
        type: "alert-success",
        message: "Loading organization details...",
        isDetailsLoading: true,
        error: null,
      };
    case organizationConstants.GET_ORGANIZATION_DETAILS.SUCCESS:
      return {
        ...state,
        type: "alert-success",
        message: "Organization details loaded successfully",
        isDetailsLoading: false,
        currentOrganization: (action.payload as OrganizationDetailsResponse).organization || null,
        error: null,
      };
    case organizationConstants.GET_ORGANIZATION_DETAILS.FAILURE:
      return {
        ...state,
        type: "alert-failure",
        isDetailsLoading: false,
        currentOrganization: null,
      };
    default:
      return state;
  }
}; 