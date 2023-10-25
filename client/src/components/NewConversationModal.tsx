import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import { useContacts } from "../contexts/ContactsProvider";
import Typography from "@mui/material/Typography";
import BaseModal from "./BaseModal";
import Button from "@mui/material/Button";
import { useConversations } from "../contexts/ConversationsProvider";
import { Recipient } from "../types/conversations";

const NewConversationModal: React.FC = () => {
  const { contacts } = useContacts();
  const { createConversation } = useConversations();
  const [recipients, setSelectedRecipients] = React.useState<Recipient[]>([]);

  const handleToggle = (recipient: Recipient) => () => {
    setSelectedRecipients((prev) =>
      {
        const foundRecipientIndex = prev.findIndex((r) => recipient.id === r.id);
        if (foundRecipientIndex > -1) {
            prev.splice(foundRecipientIndex, 1);
            return prev;
        }
        return [...prev, recipient]
      }
    );
  };

  const onClose = () => {
    setSelectedRecipients([]);
  };

  const createNewConversation = (close: () => void) => {
    createConversation(recipients);
    close();
  };

  const isChecked = (id: string) => {
    const foundRecipient = recipients.find((recipient) => recipient.id === id);
    return !!foundRecipient?.id;
  }

  return (
    <BaseModal
      renderContent={(close) => (
        <Box>
          <Typography variant="h5">Select Contacts</Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {contacts.map((value) => {
              const labelId = `checkbox-list-label-${value.id}`;

              return (
                <ListItem key={labelId} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isChecked(value.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={`${value.name} (${value.id})`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => createNewConversation(close)}
          >
            Create conversation
          </Button>
        </Box>
      )}
      renderContext={(open) => (
        <Button variant="contained" sx={{ m: 2, mt: "auto" }} onClick={open}>
          New conversation
        </Button>
      )}
      onClose={onClose}
    />
  );
};

export default NewConversationModal;
