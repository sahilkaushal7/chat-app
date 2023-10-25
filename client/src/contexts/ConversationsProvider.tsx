import * as React from "react";
import {
  ConversationsContextType,
  Conversation,
  Recipient,
  Message,
} from "../types/conversations";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "./SocketProvider";

function arrayEquality(a: Recipient[], b: Recipient[]) {
  const aIds = a.map(({ id }) => id);
  const bIds = b.map(({ id }) => id)
  if (aIds.length !== bIds.length) return false;

  aIds.sort();
  bIds.sort();

  return aIds.every((element: any, index: number) => {
    return element === bIds[index];
  });
}

export const ConversationsContext =
  React.createContext<ConversationsContextType>({} as ConversationsContextType);

interface IConversationsProvider {
  children: React.ReactNode;
  id: string;
}

export const ConversationsProvider: React.FC<IConversationsProvider> = ({
  children,
  id,
}) => {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    [] as Conversation[]
  );
  const [selectedConversation, setSelectedConversation] =
    React.useState<Conversation>({} as Conversation);
  const socket = useSocket();
  const addMessageToConversation = React.useCallback(
    ({
      recipients,
      message,
    }: {
      recipients: Recipient[];
      message: Message;
    }) => {
      let madeChange = false;
      const newConversations = conversations.map((conversation) => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true;
          const newConv = {
            ...conversation,
            messages: [...conversation.messages, message],
          };
          setSelectedConversation(newConv);
          return newConv;
        }

        return conversation;
      });

      if (madeChange) {
        setConversations(newConversations);
      } else {
        const newConv = { recipients, messages: [message] };
        setSelectedConversation(newConv);
        setConversations([...conversations, newConv]);
      }
    },
    [conversations, setConversations]
  );
  React.useEffect(() => {
    console.log("here");
    if (socket == null) return;

    socket.on("receive-message", addMessageToConversation);

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipients: Recipient[], message: Message) => {
    socket.emit("send-message", { recipients, message });
    addMessageToConversation({ recipients, message });
  };

  const createConversation = (recipients: Recipient[]) => {
    setConversations([...conversations, { recipients, messages: [] }]);
  };

  const value = {
    id,
    conversations,
    selectedConversation,
    createConversation,
    sendMessage,
    setSelectedConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  return React.useContext(ConversationsContext);
};
