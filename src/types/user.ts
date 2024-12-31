
export interface User {
  name: string;
  email: string;
  age?: number;
}

export interface UserWithId extends User {
  id: string;
}
