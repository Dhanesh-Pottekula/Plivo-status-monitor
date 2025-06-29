import { store } from "@/_redux/store";
import { 
  getServicesAction, 
  getServiceDetialAction,
  getIncidentsAction
} from "@/_redux/actions/services.actions";
import { getOrganizationDetailsAction } from "@/_redux/actions/organizations.actions";
import { getTimeLineOfOrganizationAction, getTimeLineOfServiceAction } from "@/_redux/actions/timeline.actions";
import { SOCKET_ROOM_ORG_UPDATE } from "@/_constants/socketConstants";

export const onRoomSocketMessage = (data: any) => {
  console.log("🔔 Received WebSocket message:", data);
  
  const { type, data: eventData, organization_id,room } = data;
  
  switch (type) {
    case "service_created":
    case "service_updated":
    case "service_deleted":
        handleServiceEvent(type, eventData, organization_id,room);
      break;
      
    case "incident_created":
    case "incident_updated":
    case "incident_deleted":
      handleIncidentEvent(type, eventData, organization_id);
      break;
      
    // case "organization_created":
    // case "organization_updated":
    //   handleOrganizationEvent(type, eventData, organization_id);
    //   break;
      
    // case "timeline_event":
    //   handleTimelineEvent(type, eventData, organization_id);
    //   break;
      
    default:
      console.log("📡 Unknown event type:", type);
  }
};

const handleServiceEvent = async (type: string, serviceData: any, organizationId: string,room:string) => {
  console.log(`📡 Handling service event: ${type}`, serviceData);
  
  try {
    if(location.pathname.includes("services")){
    // Refresh the services list to get the latest data
    await store.dispatch(getServicesAction(organizationId));
    await store.dispatch(getTimeLineOfOrganizationAction(organizationId));
    }else{
      await store.dispatch(getServiceDetialAction(serviceData.id));
      await store.dispatch(getTimeLineOfServiceAction(serviceData.id));
    }
    
    
    console.log(`✅ Successfully handled ${type} event`);
  } catch (error) {
    console.error(`❌ Error handling ${type} event:`, error);
  }
};

const handleIncidentEvent = async (type: string, incidentData: any, organizationId: string) => {
  console.log(`📡 Handling incident event:--`, incidentData);
  
  try {

    // Refresh the services list (since incidents are related to services)
    await store.dispatch(getIncidentsAction(incidentData.serviceId));
    // Refresh organization timeline
    await store.dispatch(getTimeLineOfServiceAction(incidentData.serviceId));
    
    console.log(`✅ Successfully handled ${type} event`);
  } catch (error) {
    console.error(`❌ Error handling ${type} event:`, error);
  }
};

const handleOrganizationEvent = async (type: string, orgData: any, organizationId: string) => {
  console.log(`📡 Handling organization event: ${type}`, orgData);
  
  try {
    // Refresh organization details
    await store.dispatch(getOrganizationDetailsAction(organizationId));
    console.log(`✅ Successfully handled ${type} event`);
  } catch (error) {
    console.error(`❌ Error handling ${type} event:`, error);
  }
};

const handleTimelineEvent = async (type: string, timelineData: any, organizationId: string) => {
  console.log(`📡 Handling timeline event: ${type}`, timelineData);
  
  try {
    // Refresh organization timeline
    if(location.pathname.includes("services")){
      await store.dispatch(getTimeLineOfOrganizationAction(organizationId));
    }else{
      await store.dispatch(getTimeLineOfServiceAction(timelineData.serviceId));
    }
    
    console.log(`✅ Successfully handled ${type} event`);
  } catch (error) {
    console.error(`❌ Error handling ${type} event:`, error);
  }
};