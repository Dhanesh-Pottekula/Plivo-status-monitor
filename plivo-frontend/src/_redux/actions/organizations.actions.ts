import type { Dispatch } from 'redux';
import axiosNodeInstance from '@/config/axios.config';
import { apiUrls } from '@/config/apiUrls';
import { organizationConstants } from '../constants/organization.constants';
import { handleError } from '@/_helpers/commonFunctions';

// Action Types
export interface OrganizationActionTypes {
  type: string;
  payload?: unknown;
}

// Get Organizations List Action
export const getOrganizationsAction = () => async (dispatch: Dispatch<OrganizationActionTypes>) => {
  dispatch({
    type: organizationConstants.GET_ORGANIZATIONS.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(apiUrls.organizations.getOrganizationsList());
    dispatch({
      type: organizationConstants.GET_ORGANIZATIONS.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: organizationConstants.GET_ORGANIZATIONS.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Get Organization Details Action
export const getOrganizationDetailsAction = (organizationId: string) => async (dispatch: Dispatch<OrganizationActionTypes>) => {
  dispatch({
    type: organizationConstants.GET_ORGANIZATION_DETAILS.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(apiUrls.organizations.getOrganizationDetails(organizationId));
    dispatch({
      type: organizationConstants.GET_ORGANIZATION_DETAILS.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: organizationConstants.GET_ORGANIZATION_DETAILS.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
