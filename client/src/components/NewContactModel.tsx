import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { User } from "../types/users";
import BaseModal from "./BaseModal";
import { useContacts } from "../contexts/ContactsProvider";

const NewContactModal: React.FC = () => {
  const [user, setUser] = React.useState<User>({} as User);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  const { saveContact } = useContacts();

  const onCreate = (close: () => void) => {
    setIsSubmitted(true);
    if (user.id && user.name) {
      saveContact(user);
      close();
    }
  };

  const onClose = () => {
    setUser({} as User);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) => {
    setUser((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  return (
    <BaseModal
      renderContent={(close) => (
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="id"
            label="Enter contact id"
            name="id"
            autoComplete="id"
            autoFocus
            value={user.id}
            onChange={(e) => onChange(e, "id")}
            error={isSubmitted && !user.id}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter contact name"
            name="name"
            autoComplete="name"
            autoFocus
            value={user.name}
            onChange={(e) => onChange(e, "name")}
            error={isSubmitted && !user.name}
          />
          <Grid container spacing={2}>
            <Grid item xs>
              <Button
                type="button"
                onClick={() => onCreate(close)}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create contact
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      renderContext={(open) => (
        <Button variant="contained" sx={{ m: 2, mt: 'auto' }} onClick={open}>
          New contact
        </Button>
      )}
      onClose={onClose}
    />
  );
};

export default NewContactModal;
