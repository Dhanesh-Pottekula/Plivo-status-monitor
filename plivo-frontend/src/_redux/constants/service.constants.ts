
import type { ServiceInterface } from "@/_constants/Interfaces/ServicesInterface";

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