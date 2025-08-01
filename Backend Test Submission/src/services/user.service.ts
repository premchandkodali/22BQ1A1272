export interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

export function createUser(user: Omit<User, 'id'>): User {
  const newUser: User = {
    id: (users.length + 1).toString(),
    ...user
  };
  users.push(newUser);
  return newUser;
}
