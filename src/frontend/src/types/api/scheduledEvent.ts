export interface ScheduledEventResponse {
  eventName: string;
  eventDate: string;
  description: string;
}

export interface ScheduledEventRequest {
  eventName: string;
  eventDate: string;
  description: string;
  receiverId: string;
}
