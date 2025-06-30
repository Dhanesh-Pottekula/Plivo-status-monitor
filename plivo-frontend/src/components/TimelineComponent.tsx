import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDate } from '@/_helpers/commonFunctions';
import type { TimelineEventInterface } from '@/_constants/Interfaces/TimelineInterfaces';
import type { AppDispatch, RootState } from '@/_redux/store';
import Loader from './ui/loader';
import { getTimeLineOfOrganizationAction, getTimeLineOfServiceAction } from '@/_redux/actions/timeline.actions';
import { useParams } from 'react-router-dom';

interface TimelineComponentProps {
  serviceId?: number;
  title?: string;
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'incident_created':
      return '🚨';
    case 'incident_updated':
      return '📝';
    case 'incident_deleted':
      return '🗑️';
    case 'service_status_changed':
      return '⚡';
    default:
      return '📋';
  }
};

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case 'incident_created':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'incident_updated':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'incident_deleted':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'service_status_changed':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getEventBorderColor = (eventType: string) => {
  switch (eventType) {
    case 'incident_created':
      return 'border-l-red-400';
    case 'incident_updated':
      return 'border-l-blue-400';
    case 'incident_deleted':
      return 'border-l-gray-400';
    case 'service_status_changed':
      return 'border-l-yellow-400';
    default:
      return 'border-l-gray-400';
  }
};

const TimelineEvent: React.FC<{ event: TimelineEventInterface }> = ({ event }) => {
  return (
    <div className={`relative flex items-start space-x-2 sm:space-x-4 p-3 sm:p-4 md:p-6 border-l-4 ${getEventBorderColor(event.eventType)} bg-white hover:bg-gray-50 transition-all duration-200 ease-in-out group`}>
      {/* Timeline dot */}
      <div className="absolute left-[-0.3rem] top-6 sm:top-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1.5 group-hover:border-blue-400 transition-colors duration-200" />
      
      {/* Icon container */}
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm sm:text-base md:text-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
        {getEventIcon(event.eventType)}
      </div>
      
      {/* Content container */}
      <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
        {/* Header with title and badge */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 leading-tight pr-2">
            {event.title}
          </h4>
          <Badge className={`text-xs px-2 py-1 border ${getEventColor(event.eventType)} whitespace-nowrap self-start sm:self-auto`}>
            {event.eventType.replace(/_/g, ' ')}
          </Badge>
        </div>
        
        {/* Description */}
        {event.description && (
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {event.description} - by {event.userName} - on {formatDate(event.createdAt)}
          </p>
        )}
        
        {/* Value changes */}
        {(event.oldValue || event.newValue) && (
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 space-y-1">
            <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Changes:</div>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0 sm:flex sm:flex-row sm:gap-4">
              {event.oldValue && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-red-500 text-xs">From:</span>
                  <span className="line-through text-gray-500 break-words">{event.oldValue}</span>
                </div>
              )}
              {event.newValue && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-green-500 text-xs">To:</span>
                  <span className="font-medium text-gray-900 break-words">{event.newValue}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineComponent: React.FC<TimelineComponentProps> = ({ 
  serviceId, 
  title = "Timeline" 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceTimeline, organizationTimeline } = useSelector((state: RootState) => state.timelineReducer);
  const {org_id} = useParams();
  const timelineData = serviceId ? serviceTimeline : organizationTimeline;
  const loading = timelineData.loading;
  const error = timelineData.error;
  const events = timelineData.data;

  useEffect(() => {
    if (serviceId) {
      dispatch(getTimeLineOfServiceAction(serviceId));
    } else if (org_id) {
      dispatch(getTimeLineOfOrganizationAction(org_id));
    }
  }, [dispatch, serviceId,org_id]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8 sm:py-12">
            <Loader />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-500 text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
            <p className="text-red-600 font-medium text-sm sm:text-base">Error loading timeline</p>
            <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4">📋</div>
            <p className="text-gray-500 font-medium text-sm sm:text-base">No timeline events found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Events will appear here as they occur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border-0 bg-white">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100">
        <CardTitle className="text-sm sm:text-base md:text-xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>{title}</span>
          <span className="text-xs sm:text-sm font-normal text-gray-500 sm:ml-auto">
            ({events.length} {events.length === 1 ? 'event' : 'events'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {/* Events */}
          <div className="space-y-0">
            {events.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineComponent; 