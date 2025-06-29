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

    case serviceConstants.CREATE_SERVICE.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Creating service...",
      };
    case serviceConstants.CREATE_SERVICE.SUCCESS: {
      const newService = action.payload as ServiceInterface;
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Service created successfully",
        services: [...(state.services || []), newService],
        error: null,
      };
    }
    case serviceConstants.CREATE_SERVICE.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to create service",
        message: null,
      };

    case serviceConstants.UPDATE_SERVICE.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Updating service...",
      };
    case serviceConstants.UPDATE_SERVICE.SUCCESS: {
      const updatedService = action.payload as ServiceInterface;
      const updatedServices = (state.services || []).map(service =>
        service.id === updatedService.id ? updatedService : service
      );
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Service updated successfully",
        services: updatedServices,
        error: null,
      };
    }
    case serviceConstants.UPDATE_SERVICE.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to update service",
        message: null,
      };

    case serviceConstants.DELETE_SERVICE.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Deleting service...",
      };
    case serviceConstants.DELETE_SERVICE.SUCCESS: {
      const { id } = action.payload as { id: number };
      const filteredServices = (state.services || []).filter(service => service.id !== id);
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Service deleted successfully",
        services: filteredServices,
        error: null,
      };
    }
    case serviceConstants.DELETE_SERVICE.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to delete service",
        message: null,
      };

    default:
      return state;
  }
};
