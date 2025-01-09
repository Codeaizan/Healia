export type UserRole = 'admin' | 'reception' | 'guest';

export interface User {
  username: string;
  role: UserRole;
}

export const USERS = {
  admin: {
    username: 'admin',
    password: '2811',
    role: 'admin' as UserRole
  },
  reception: {
    username: 'reception',
    password: '4632',
    role: 'reception' as UserRole
  },
  guest: {
    username: 'guest',
    password: '1234',
    role: 'guest' as UserRole
  }
};