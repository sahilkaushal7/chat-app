export enum Tab {
  CONVERSATIONS = "conversations",
  CONTACTS = "contacts",
}

export type TabConfig = {
  name: string;
  Component: React.FC;
  ButtonModal: React.FC;
  Icon: React.FC;
  id: Tab;
};
