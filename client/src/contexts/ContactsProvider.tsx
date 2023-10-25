import * as React from "react";
import { ContactsContextType } from "../types/contacts";
import { User } from "../types/users";
import useLocalStorage from "../hooks/useLocalStorage";

export const ContactsContext = React.createContext<ContactsContextType>(
  {} as ContactsContextType
);

interface IContactProvider {
  children: React.ReactNode;
}

export const ContactsProvider: React.FC<IContactProvider> = ({ children }) => {
  const [contacts, setContacts] = useLocalStorage("contacts", [] as User[]);
  const saveContact = (contact: User) => {
    setContacts([...contacts, contact]);
  };
  const deleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    console.log(contactId, contacts, updatedContacts);
    setContacts(updatedContacts);
  }
  return (
    <ContactsContext.Provider value={{ contacts, saveContact, deleteContact }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  return React.useContext(ContactsContext);
};
