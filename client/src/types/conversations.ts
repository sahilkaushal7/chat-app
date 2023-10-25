export type Message = {
  message: string;
  userId: string;
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
  id: string;
  conversations: Conversation[];
  selectedConversation: Conversation;
  createConversation: (recipients: Recipient[]) => void;
  sendMessage: (recipients: Recipient[], message: Message) => void;
  setSelectedConversation: (conversation: Conversation) => void;
};
