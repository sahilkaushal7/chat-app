import * as React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NewContactModal from "./Modals/NewContactModal";
import Typography from "@mui/material/Typography";
import { useContacts } from "../contexts/ContactsProvider";

const Contacts: React.FC = () => {
  const { contacts } = useContacts();

  return (
    <List>
      {contacts.length ? (
        contacts.map((value) => {
          const labelId = `checkbox-list-label-${value.id}`;

          return (
            <ListItem disablePadding key={labelId}>
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={value.name}
                  secondary={`ID - ${value.id}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })
      ) : (
        <Box textAlign="center">
          <Typography marginBottom={2}>No contacts created yet</Typography>
          <NewContactModal />
        </Box>
      )}
    </List>
  );
};

export default Contacts;
