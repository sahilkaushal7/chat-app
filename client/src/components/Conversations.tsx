import * as React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Conversation } from "../types/conversations";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NewConversationModal from "./Modals/NewConversationModal";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useConversations } from "../contexts/ConversationsProvider";

enum View {
  CONVERSATIONS = "conversations",
  MESSAGES = "messages",
}

interface IConversations {
  id: string;
  name: string;
}

const Conversations: React.FC<IConversations> = ({ id, name }) => {
  const [view, setView] = React.useState(View.CONVERSATIONS);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState("");
  const {
    conversations,
    selectedConversation,
    sendMessage,
    setSelectedConversation,
  } = useConversations();
  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView(View.MESSAGES);
  };

  const handleConversationClose = () => {
    setView(View.CONVERSATIONS);
    setText("");
  };

  const sendNewMessage = () => {
    sendMessage(selectedConversation.recipients, {
      message: text,
      userId: id,
      userName: name,
    });
    setText("");
  };

  React.useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  return view === View.CONVERSATIONS ? (
    <List>
      {conversations.length ? (
        conversations.map((conversation, index) => {
          const labelId = `checkbox-list-label-${index}`;
          const lastSender = conversation.messages.length
            ? conversation.messages?.[conversation.messages.length - 1]
                ?.userId === id
              ? "You"
              : conversation.messages?.[conversation.messages.length - 1]
                  ?.userName
            : conversation.recipients.map(({ name }) => name).join(", ");
          const lastMessage =
            conversation.messages?.[conversation.messages.length - 1]
              ?.message || "No Last Message";
          return (
            <ListItem
              key={labelId}
              disablePadding
              onClick={() => openConversation(conversation)}
            >
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={lastSender}
                  secondary={lastMessage}
                />
              </ListItemButton>
            </ListItem>
          );
        })
      ) : (
        <Box textAlign="center">
          <Typography marginBottom={2}>No conversations created yet</Typography>
          <NewConversationModal />
        </Box>
      )}
    </List>
  ) : (
    <Box display="flex" flexDirection="column" overflow="auto" flex="1">
      <List sx={{ bgcolor: "background.paper", overflow: "auto", flex: "1" }}>
        {selectedConversation.messages.map((message, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                flexDirection: message.userId === id ? "row" : "row-reverse",
              }}
            >
              <ListItemAvatar>
                <Avatar alt={message.userId} />
              </ListItemAvatar>
              <ListItemText
                sx={
                  message.userId === id
                    ? { textAlign: "left" }
                    : { textAlign: "right", mr: 2 }
                }
                primary={message.userId === id ? "You" : message.userName}
                secondary={message.message}
              />

              {selectedConversation.messages.length - 1 === index && (
                <div ref={lastMessageRef} />
              )}
            </ListItem>
            {selectedConversation.messages.length - 1 > index && (
              <Divider variant="fullWidth" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      <Box padding={2}>
        <TextField
          id="outlined-textarea"
          placeholder="Enter your message"
          multiline
          maxRows={2}
          focused
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        <Box
          marginTop={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            startIcon={<ChevronLeftIcon />}
            onClick={handleConversationClose}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={sendNewMessage}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Conversations;
