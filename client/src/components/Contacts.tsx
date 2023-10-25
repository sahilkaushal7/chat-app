import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useContacts } from "../contexts/ContactsProvider";

const Contacts: React.FC = () => {
  const { contacts } = useContacts();

  return (
    <List>
      {contacts.map((value) => {
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
      })}
    </List>
  );
};

export default Contacts;
