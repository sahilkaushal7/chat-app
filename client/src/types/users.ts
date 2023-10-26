export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
}

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};
