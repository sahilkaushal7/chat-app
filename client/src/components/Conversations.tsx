import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useConversations } from "../contexts/ConversationsProvider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Conversation } from "../types/conversations";
import { Send } from "@mui/icons-material";

enum View {
  CONVERSATIONS = "conversations",
  MESSAGES = "messages",
}

const Conversations: React.FC = () => {
  const [view, setView] = React.useState(View.CONVERSATIONS);

  const [text, setText] = React.useState("");
  const {
    id,
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
  };

  const sendNewMessage = () => {
    sendMessage(selectedConversation.recipients, { message: text, userId: id });
    setText("");
  };

  return view === View.CONVERSATIONS ? (
    <List>
      {conversations.map((conversation, index) => {
        const labelId = `checkbox-list-label-${index}`;

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
                primary={""}
                secondary={
                  conversation.messages?.[0]?.message || "No Last Message"
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <Box>
      <List
        sx={{ bgcolor: "background.paper" }}
        subheader={
          <IconButton sx={{ m: 1 }} onClick={handleConversationClose}>
            <ChevronLeftIcon />
          </IconButton>
        }
      >
        {selectedConversation.messages.map((message) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={message.userId} />
              </ListItemAvatar>
              <ListItemText
                primary={message.message}
                secondary={message.userId === id ? "You" : "Someone"}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <Box>
        <TextField
          id="outlined-textarea"
          placeholder="Enter your message"
          multiline
          maxRows={2}
          focused
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ p: 2 }}
          fullWidth
        />
        <IconButton
          sx={{ alignSelf: "flex-end" }}
          onClick={() => sendNewMessage()}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Conversations;
