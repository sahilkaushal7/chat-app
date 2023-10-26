import * as React from "react";

import {
  Conversation,
  ConversationsContextType,
  Message,
  Recipient,
} from "../types/conversations";

import Snackbar from "@mui/material/Snackbar";
import { useContacts } from "./ContactsProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "./SocketProvider";

function arrayEquality(a: Recipient[], b: Recipient[]) {
  const aIds = a.map(({ id }) => id);
  const bIds = b.map(({ id }) => id);
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
}

export const ConversationsProvider: React.FC<IConversationsProvider> = ({
  children,
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState({
    open: false,
    userName: "",
    status: "",
  });
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    [] as Conversation[]
  );
  const { contacts } = useContacts();
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
    if (socket == null) return;

    socket.on("receive-message", addMessageToConversation);

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipients: Recipient[], message: Message) => {
    socket.emit("send-message", { recipients, message });
    addMessageToConversation({ recipients, message });
  };

  React.useEffect(() => {
    if (socket == null) return;

    socket.on(
      "status-update",
      ({ status, name }: { id: string; status: string; name: string }) => {
        setSnackbarOpen({
          open: true,
          userName: name,
          status,
        });
        setTimeout(() => {
          setSnackbarOpen((prev) => ({
            ...prev,
            open: false,
          }));
        }, 5000);
      }
    );

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  const changeStatus = React.useCallback(
    (status: string) => {
      const contactsId = contacts.map(({ id }) => id);
      socket.emit("change-status", { recipients: contactsId, status });
    },
    [contacts, socket]
  );

  const createConversation = React.useCallback(
    (recipients: Recipient[]) => {
      setConversations([...conversations, { recipients, messages: [] }]);
    },
    [conversations, setConversations]
  );

  const value = {
    conversations,
    selectedConversation,
    createConversation,
    sendMessage,
    setSelectedConversation,
    changeStatus,
  };

  return (
    <ConversationsContext.Provider value={value}>
      <Snackbar
        open={snackbarOpen.open}
        message={`${snackbarOpen.userName} went ${snackbarOpen.status}`}
      />
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  return React.useContext(ConversationsContext);
};
