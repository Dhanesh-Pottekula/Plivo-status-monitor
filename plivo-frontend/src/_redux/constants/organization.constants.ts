import type { Error_response_on_api_failure } from "@/_constants/Interfaces/ResponseInterfaces";
import type { OrganizationsResponse, OrganizationDetailsResponse } from "@/_constants/Interfaces/OrganizationInterfaces";

const createAsyncActionTypes = (base: string) => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`,
});

export const organizationConstants = {
  GET_ORGANIZATIONS: createAsyncActionTypes("GET_ORGANIZATIONS"),
  GET_ORGANIZATION_DETAILS: createAsyncActionTypes("GET_ORGANIZATION_DETAILS"),
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export type OrganizationActionTypes =
  | { type: typeof organizationConstants.GET_ORGANIZATIONS.REQUEST; payload: null }
  | { type: typeof organizationConstants.GET_ORGANIZATIONS.SUCCESS; payload: OrganizationsResponse }
  | { type: typeof organizationConstants.GET_ORGANIZATIONS.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof organizationConstants.GET_ORGANIZATION_DETAILS.REQUEST; payload: null }
  | { type: typeof organizationConstants.GET_ORGANIZATION_DETAILS.SUCCESS; payload: OrganizationDetailsResponse }
  | { type: typeof organizationConstants.GET_ORGANIZATION_DETAILS.FAILURE; payload: Error_response_on_api_failure | null }
  | { type: typeof organizationConstants.CLEAR_ERROR; payload: null }; 