import type { Dispatch } from 'redux';
import axiosNodeInstance from '@/config/axios.config';
import { apiUrls } from '@/config/apiUrls';
import { handleError } from '@/_helpers/commonFunctions';
import { serviceConstants, type ServiceActionTypes } from '../constants/service.constants';
import type { ServiceInterface } from '@/_constants/Interfaces/ServicesInterface';

// Action Types


// Get Services Action
export const getServicesAction = () => async (dispatch: Dispatch<ServiceActionTypes>) => {
  dispatch({
    type: serviceConstants.GET_SERVICES.REQUEST,
    payload: null,
  });
  
  try {
    const response = await axiosNodeInstance.get(apiUrls.services.getServicesList);
    dispatch({
      type: serviceConstants.GET_SERVICES.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    dispatch({
      type: serviceConstants.GET_SERVICES.FAILURE,
      payload: errorMessage,
    });
    return errorMessage;
  }
};
export const getServiceDetialAction = (id: number) => async (dispatch: Dispatch<ServiceActionTypes>) => {
  dispatch({
    type: serviceConstants.GET_SERVICE_DETAILS.REQUEST,
    payload: null,
  });
  
  try {
    const url = apiUrls.services.getSeriviceDetails.replace(':id', id.toString());
    const response = await axiosNodeInstance.get(url);
    dispatch({
      type: serviceConstants.GET_SERVICE_DETAILS.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: serviceConstants.GET_SERVICE_DETAILS.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Create Service Action
export const createServiceAction = (serviceData: Partial<ServiceInterface>) => async (dispatch: Dispatch<ServiceActionTypes>) => {
  dispatch({
    type: serviceConstants.CREATE_SERVICE.REQUEST,
    payload: serviceData,
  });
  
  try {
    const response = await axiosNodeInstance.post(apiUrls.services.createService, serviceData);
    dispatch({
      type: serviceConstants.CREATE_SERVICE.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: serviceConstants.CREATE_SERVICE.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Update Service Action
export const updateServiceAction = (id: number, serviceData: Partial<ServiceInterface>) => async (dispatch: Dispatch<ServiceActionTypes>) => {
  dispatch({
    type: serviceConstants.UPDATE_SERVICE.REQUEST,
    payload: serviceData,
  });
  
  try {
    const url = apiUrls.services.updateService.replace(':id', id.toString());
    const response = await axiosNodeInstance.put(url, serviceData);
    dispatch({
      type: serviceConstants.UPDATE_SERVICE.SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: serviceConstants.UPDATE_SERVICE.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Delete Service Action
export const deleteServiceAction = (id: number) => async (dispatch: Dispatch<ServiceActionTypes>) => {
  dispatch({
    type: serviceConstants.DELETE_SERVICE.REQUEST,
    payload: { id },
  });
  
  try {
    const url = apiUrls.services.deleteService.replace(':id', id.toString());
    const response = await axiosNodeInstance.delete(url);
    dispatch({
      type: serviceConstants.DELETE_SERVICE.SUCCESS,
      payload: { id },
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: serviceConstants.DELETE_SERVICE.FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};