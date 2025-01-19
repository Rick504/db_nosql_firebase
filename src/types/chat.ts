export interface CreateChat {
  senderId: string;
  recipientIds: string[];
  title: string,
  content: string;
}

export interface CreateMessage {
  chatId: string;
  senderId: string;
  content: string;
}
