import type { ServiceInterface, IncidentInterface } from "@/_constants/Interfaces/ServicesInterface";

const createAsyncActionTypes = (base: string) => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`,
});

export const serviceConstants = {
    GET_SERVICES: createAsyncActionTypes("GET_SERVICES"),
    CREATE_SERVICE: createAsyncActionTypes("CREATE_SERVICE"),
    UPDATE_SERVICE: createAsyncActionTypes("UPDATE_SERVICE"),
    DELETE_SERVICE: createAsyncActionTypes("DELETE_SERVICE"),
    GET_SERVICE_DETAILS: createAsyncActionTypes("GET_SERVICE_DETAILS"),
    GET_INCIDENTS: createAsyncActionTypes("GET_INCIDENTS"),
    CREATE_INCIDENT: createAsyncActionTypes("CREATE_INCIDENT"),
    UPDATE_INCIDENT: createAsyncActionTypes("UPDATE_INCIDENT"),
    DELETE_INCIDENT: createAsyncActionTypes("DELETE_INCIDENT"),
};

export type ServiceActionTypes =
  | { type: typeof serviceConstants.GET_SERVICES.REQUEST; payload: null }
  | { type: typeof serviceConstants.GET_SERVICES.SUCCESS; payload: ServiceInterface[] }
  | { type: typeof serviceConstants.GET_SERVICES.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.CREATE_SERVICE.REQUEST; payload: Partial<ServiceInterface> }
  | { type: typeof serviceConstants.CREATE_SERVICE.SUCCESS; payload: ServiceInterface }
  | { type: typeof serviceConstants.CREATE_SERVICE.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.UPDATE_SERVICE.REQUEST; payload: Partial<ServiceInterface> }
  | { type: typeof serviceConstants.UPDATE_SERVICE.SUCCESS; payload: ServiceInterface }
  | { type: typeof serviceConstants.UPDATE_SERVICE.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.DELETE_SERVICE.REQUEST; payload: { id: number } }
  | { type: typeof serviceConstants.DELETE_SERVICE.SUCCESS; payload: { id: number } }
  | { type: typeof serviceConstants.DELETE_SERVICE.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.GET_SERVICE_DETAILS.REQUEST; payload: null }
  | { type: typeof serviceConstants.GET_SERVICE_DETAILS.SUCCESS; payload: ServiceInterface }
  | { type: typeof serviceConstants.GET_SERVICE_DETAILS.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.GET_INCIDENTS.REQUEST; payload: null }
  | { type: typeof serviceConstants.GET_INCIDENTS.SUCCESS; payload: IncidentInterface[] }
  | { type: typeof serviceConstants.GET_INCIDENTS.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.CREATE_INCIDENT.REQUEST; payload: Partial<IncidentInterface> }
  | { type: typeof serviceConstants.CREATE_INCIDENT.SUCCESS; payload: IncidentInterface }
  | { type: typeof serviceConstants.CREATE_INCIDENT.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.UPDATE_INCIDENT.REQUEST; payload: Partial<IncidentInterface> }
  | { type: typeof serviceConstants.UPDATE_INCIDENT.SUCCESS; payload: IncidentInterface }
  | { type: typeof serviceConstants.UPDATE_INCIDENT.FAILURE; payload: { message: string } | null }
  | { type: typeof serviceConstants.DELETE_INCIDENT.REQUEST; payload: { serviceId: number; incidentId: number } }
  | { type: typeof serviceConstants.DELETE_INCIDENT.SUCCESS; payload: { serviceId: number; incidentId: number } }
  | { type: typeof serviceConstants.DELETE_INCIDENT.FAILURE; payload: { message: string } | null }