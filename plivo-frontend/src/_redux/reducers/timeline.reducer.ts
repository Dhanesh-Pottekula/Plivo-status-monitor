import type { TimelineActionTypes } from "@/_redux/actions/timeline.actions";
import { timelineConstants } from "../../_constants/timelineConstants";
import type { TimelineState } from "@/_constants/Interfaces/TimelineInterfaces";

const initialState: TimelineState = {
  serviceTimeline: {
    data: null,
    loading: false,
    error: null,
  },
  organizationTimeline: {
    data: null,
    loading: false,
    error: null,
  },
};

export const timelineReducer = (state = initialState, action: TimelineActionTypes): TimelineState => {
  switch (action.type) {
    case timelineConstants.GET_TIME_LINE_OF_SERVICE.REQUEST:
      return {
        ...state,
        serviceTimeline: {
          ...state.serviceTimeline,
          loading: true,
          error: null,
        },
      };

    case timelineConstants.GET_TIME_LINE_OF_SERVICE.SUCCESS:
      return {
        ...state,
        serviceTimeline: {
          data: action.payload as any,
          loading: false,
          error: null,
        },
      };

    case timelineConstants.GET_TIME_LINE_OF_SERVICE.FAILURE:
      return {
        ...state,
        serviceTimeline: {
          ...state.serviceTimeline,
          loading: false,
          error: action.payload as string,
        },
      };

    case timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.REQUEST:
      return {
        ...state,
        organizationTimeline: {
          ...state.organizationTimeline,
          loading: true,
          error: null,
        },
      };

    case timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.SUCCESS:
      return {
        ...state,
        organizationTimeline: {
          data: action.payload as any,
          loading: false,
          error: null,
        },
      };

    case timelineConstants.GET_TIME_LINE_OF_ORGANIZATION.FAILURE:
      return {
        ...state,
        organizationTimeline: {
          ...state.organizationTimeline,
          loading: false,
          error: action.payload as string,
        },
      };

    default:
      return state;
  }
}; 