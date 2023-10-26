export enum Tab {
  CONVERSATIONS = "conversations",
  CONTACTS = "contacts",
}

export type UserDetails = {
  id: string;
  name: string;
}

export type TabConfig = {
  name: string;
  Component: React.FC<UserDetails>;
  ButtonModal: React.FC;
  Icon: React.FC;
  id: Tab;
  props: {
    id: string;
    name: string;
  }
};
