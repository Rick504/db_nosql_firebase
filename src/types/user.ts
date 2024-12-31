export interface User {
  name: string;
  email: string;
  password: string;
  history?: UserHistory;
}

export interface UserWithId extends User {
  id: string;
}

export interface UserHistory {
  updates: Array<HistoryEntry>;
  deletions: Array<HistoryEntry>;
}

export interface HistoryEntry {
  name: string;
  email: string;
  created_at: string;
  ip_address: string;
}
