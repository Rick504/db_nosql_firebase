export interface UserBase {
  name: string;
  email: string;
  password: string;
  ipAddress?: string;
}

export interface User extends UserBase {
  history: UserHistory;
}

export interface UserWithId extends User {
  id: string;
}

export interface UserHistory {
  updates: HistoryEntry[];
  deletions: HistoryEntry[];
}

export interface HistoryEntry {
  name: string;
  email: string;
  created_at: string;
  ip_address: string;
}

export interface UserJwt {
  id?: string;
  name: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export interface UserOldUpdate extends UserBase {
  ipAddress: string;
}

export interface UpdateUserRequest extends User, UserWithId {}

