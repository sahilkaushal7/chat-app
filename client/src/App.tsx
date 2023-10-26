import * as React from "react";

import { ContactsProvider } from "./contexts/ContactsProvider";
import { ConversationsProvider } from "./contexts/ConversationsProvider";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { SocketProvider } from "./contexts/SocketProvider";
import { User } from "./types/users";
import useLocalStorage from "./hooks/useLocalStorage";

const App: React.FC = () => {
  const [{ id, name }, setUser] = useLocalStorage<User>("id", {} as User);

  const onUserSubmit = (newUser: User) => {
    setUser(newUser);
  };

  const dashboard = (
    <SocketProvider id={id} name={name}>
      <ContactsProvider>
        <ConversationsProvider>
          <Dashboard id={id} name={name} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  return name ? dashboard : <Login onUserSubmit={onUserSubmit} />;
};

export default App;
