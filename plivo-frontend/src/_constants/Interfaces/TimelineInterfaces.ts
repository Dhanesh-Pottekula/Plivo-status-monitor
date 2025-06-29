export type TimelineEventType = 
  | 'incident_created'
  | 'incident_updated'
  | 'incident_deleted'
  | 'service_status_changed';

export interface TimelineEventInterface {
  id: number;
  organizationId: string;
  eventType: TimelineEventType;
  contentType: string;
  objectId: number;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface TimelineResponseInterface {
  timeline: TimelineEventInterface[];
  count: number;
}

export interface TimelineState {
  serviceTimeline: {
    data: TimelineEventInterface[] | null;
    loading: boolean;
    error: string | null;
  };
  organizationTimeline: {
    data: TimelineEventInterface[] | null;
    loading: boolean;
    error: string | null;
  };
} 