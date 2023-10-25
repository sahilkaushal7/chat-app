import * as React from "react";
import Login from "./components/Login";
import useLocalStorage from "./hooks/useLocalStorage";
import Dashboard from "./components/Dashboard";
import { User } from "./types/users";
import { ContactsProvider } from "./contexts/ContactsProvider";
import { ConversationsProvider } from "./contexts/ConversationsProvider";
import { SocketProvider } from "./contexts/SocketProvider";

const App: React.FC = () => {
  const [{ id, name }, setUser] = useLocalStorage<User>("id", {
    id: "",
    name: "",
  } as User);

  const onUserSubmit = (newUser: User) => {
    setUser(newUser);
  };

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  return <div>{name ? dashboard : <Login onUserSubmit={onUserSubmit} />}</div>;
};

export default App;
