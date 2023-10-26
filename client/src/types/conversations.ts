import { UserStatus } from "./users";

export type Message = {
  message: string;
  userId: string;
  userName: string;
};

export type Recipient = {
  name: string;
  id: string;
};

export type Conversation = {
  messages: Message[];
  recipients: Recipient[];
};

export type ConversationsContextType = {
  conversations: Conversation[];
  selectedConversation: Conversation;
  createConversation: (recipients: Recipient[]) => void;
  sendMessage: (recipients: Recipient[], message: Message) => void;
  setSelectedConversation: (conversation: Conversation) => void;
  changeStatus: (status: UserStatus) => void;
};
