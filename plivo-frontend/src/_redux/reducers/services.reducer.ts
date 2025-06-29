import type { ServiceInterface } from "@/_constants/Interfaces/ServicesInterface";
import {
  serviceConstants,
  type ServiceActionTypes,
} from "../constants/service.constants";

interface UserState {
  type?: string | null;
  message?: string | null;
  error?: string | null;
  services?: ServiceInterface[] | [];
  loading?: boolean;
  service?: ServiceInterface | null;
}

const initialState: UserState = {
  type: null,
  message: null,
  error: null,
  services: [],
  loading: false,
};

export const getServicesListReducer = (
  state = initialState,
  action: ServiceActionTypes
): UserState => {
  switch (action.type) {
    case serviceConstants.GET_SERVICES.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Loading services...",
      };
    case serviceConstants.GET_SERVICES.SUCCESS: {
      const response = action.payload as ServiceInterface[];
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Services fetched successfully",
        services: response,
        error: null,
      };
    }
    case serviceConstants.GET_SERVICES.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to fetch services",
        message: null,
      };
    
    default:
      return state;
  }
};

export const getServiceDetailsReducer = (
  state = initialState,
  action: ServiceActionTypes
): UserState => {
  switch (action.type) {
    case serviceConstants.GET_SERVICE_DETAILS.REQUEST:
      return {
        ...state,
        loading: true,  
        type: "alert-info",
        message: "Loading service details...",
      };
    case serviceConstants.GET_SERVICE_DETAILS.SUCCESS: {
      const response = action.payload as ServiceInterface;
      return {
        ...state,
        loading: false,
        type: "alert-success",  
        message: "Service details fetched successfully",
        service: response as ServiceInterface,
        error: null,
      };
    }
    case serviceConstants.GET_SERVICE_DETAILS.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to fetch service details",
        message: null,
      };
    default:
      return state;
  }
};