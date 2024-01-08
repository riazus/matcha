export interface NotificationsResponse {
  id: string;
  text: string;
  date: string;
  //notificationType: NotificationType;
}

export enum NotificationType {
  profileLiked = 0,
  profileViewed = 1,
  messageReceived = 2,
  profileMatched = 3,
  profileUnliked = 4,
}
