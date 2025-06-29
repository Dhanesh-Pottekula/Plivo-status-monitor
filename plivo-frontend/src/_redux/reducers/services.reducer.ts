import type { ServiceInterface, IncidentInterface } from "@/_constants/Interfaces/ServicesInterface";
import {
  serviceConstants,
  type ServiceActionTypes,
} from "../constants/service.constants";

interface UserState {
  type?: string | null;
  message?: string | null;
  error?: string | null;
  services?: ServiceInterface[] | [];
  service?: ServiceInterface | null;
  incidents?: IncidentInterface[] | [];
  loading?: boolean;
}

const initialState: UserState = {
  type: null,
  message: null,
  error: null,
  services: [],
  service: null,
  incidents: [],
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

export const getIncidentsReducer = (
  state = initialState,
  action: ServiceActionTypes
): UserState => {
  switch (action.type) {
    case serviceConstants.GET_INCIDENTS.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Loading incidents...",
      };
    case serviceConstants.GET_INCIDENTS.SUCCESS: {
      const response = action.payload as IncidentInterface[];
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Incidents fetched successfully",
        incidents: response,
        error: null,
      };
    }
    case serviceConstants.GET_INCIDENTS.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to fetch incidents",
        message: null,
      };
    
    case serviceConstants.CREATE_INCIDENT.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Creating incident...",
      };
    case serviceConstants.CREATE_INCIDENT.SUCCESS: {
      const response = action.payload as IncidentInterface;
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Incident created successfully",
        incidents: [...(state.incidents || []), response],
        error: null,
      };
    }
    case serviceConstants.CREATE_INCIDENT.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to create incident",
        message: null,
      };
    
    case serviceConstants.UPDATE_INCIDENT.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Updating incident...",
      };
    case serviceConstants.UPDATE_INCIDENT.SUCCESS: {
      const response = action.payload as IncidentInterface;
      const updatedIncidents = state.incidents?.map(incident => 
        incident.id === response.id ? response : incident
      ) || [];
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Incident updated successfully",
        incidents: updatedIncidents,
        error: null,
      };
    }
    case serviceConstants.UPDATE_INCIDENT.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to update incident",
        message: null,
      };
    
    case serviceConstants.DELETE_INCIDENT.REQUEST:
      return {
        ...state,
        loading: true,
        type: "alert-info",
        message: "Deleting incident...",
      };
    case serviceConstants.DELETE_INCIDENT.SUCCESS: {
      const { incidentId } = action.payload as { serviceId: number; incidentId: number };
      const filteredIncidents = state.incidents?.filter(incident => incident.id !== incidentId) || [];
      return {
        ...state,
        loading: false,
        type: "alert-success",
        message: "Incident deleted successfully",
        incidents: filteredIncidents,
        error: null,
      };
    }
    case serviceConstants.DELETE_INCIDENT.FAILURE:
      return {
        ...state,
        loading: false,
        type: "alert-error",
        error: (action.payload as { message: string })?.message || "Failed to delete incident",
        message: null,
      };
    
    default:
      return state;
  }
};