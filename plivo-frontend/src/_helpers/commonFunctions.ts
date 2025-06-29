import type { IncidentStatusType, ServiceStatusType } from "@/_constants/Interfaces/ServicesInterface";

export const handleError = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        return { message: response.data.message };
      }
    }
    return { message: 'Something went wrong' };
  };
  

  export const getStatusBadgeVariant = (status: ServiceStatusType | IncidentStatusType) => {
    switch (status) {
      case "operational":
        return "default";
      case "degraded_performance":
        return "secondary";
      case "partial_outage":
        return "destructive";
      case "major_outage":
        return "destructive";
      case "investigating":
        return "default";
      case "identified":
        return "secondary";
      case "monitoring":
        return "destructive";
      case "resolved":
        return "default";
      default:
        return "default";
    }
  };

  export const formatDate = (dateString: string) => {
    try {
      // Normalize format: Replace "+00:00Z" or any offset ending with 'Z' to 'Z' (if any)
      const normalizedDateString = dateString.replace(/\+00:00Z$/, 'Z');
  
      const date = new Date(normalizedDateString);
  
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
  
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short", // optional: adds "UTC" or local timezone
      });
    } catch (error) {
      return "Invalid Date";
    }
  };
  