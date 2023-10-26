import { User } from "./users";

export type ContactsContextType = {
    contacts: User[];
    saveContact: (contact: User) => void;
}