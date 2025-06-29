import { apiUrls } from "@/config/apiUrls";
import { timelineConstants } from "../../_constants/timelineConstants";
import type { Dispatch } from "redux";
import { handleError } from "@/_helpers/commonFunctions";
import axiosNodeInstance from "@/config/axios.config";
import type { TimelineEventInterface, TimelineResponseInterface } from "@/_constants/Interfaces/TimelineInterfaces";

export interface TimelineActionTypes {
  type: string;
  payload: TimelineEventInterface[] | string | null;
}

export const getTimeLineOfServiceAction = (serviceId: number) => async (dispatch: Dispatch<TimelineActionTypes>) => {
    dispatch({
      type: timelineConstants.GET_TIME_LINE_OF_SERVICE.REQUEST,
      payload: null,
    });
    
    try {
      const response = await axiosNodeInstance.get<TimelineResponseInterface>(apiUrls.timeline.getTimeLineOfService(serviceId));
      dispatch({
        type: timelineConstants.GET_TIME_LINE_OF_SERVICE.SUCCESS,
        payload: response.data.timeline,
      });
      return response.data.timeline;
    } catch (error) {
      const errorResult = handleError(error);
      dispatch({
        type: timelineConstants.GET_TIME_LINE_OF_SERVICE.FAILURE,
        payload: errorResult.message,
      });
      throw error;
    }
  };

  export const getTimeLineOfOrganizationAction = () => async (dispatch: Dispatch<TimelineActionTypes>) => {
    dispatch({
      type: timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.REQUEST,
      payload: null,
    });

    try {
      const response = await axiosNodeInstance.get<TimelineResponseInterface>(apiUrls.timeline.getTimeLineOfOrganization());
      dispatch({
        type: timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.SUCCESS,
        payload: response.data.timeline,
      });
      return response.data.timeline;
    } catch (error) {
      const errorResult = handleError(error);
      dispatch({
        type: timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.FAILURE,
        payload: errorResult.message,
      });
      throw error;
    }
  };        