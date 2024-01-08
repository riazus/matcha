export interface MessageDataResponse {
  chatId: string;
  messages: MessageResponse[];
}

interface MessageResponse {
  username: string;
  date: string;
  text: string;
}

export interface MessageRequest {
  firstUserId: string;
  secondUserId: string;
}
