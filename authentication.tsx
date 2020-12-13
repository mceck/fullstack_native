import React, { useContext, useState } from 'react';

let accessToken = '';

export const setAccessToken = (token: string) => (accessToken = token);

export const getAccessToken = () => accessToken;

export type Role = 'admin' | 'user' | string;

export interface User {
  authenticated: boolean;
  username: string;
  email: string;
  role: Role;
  exp: number;
}

export interface UserProviderState {
  user: User;
  setUser: Function;
}

export const EmptyUser: User = {
  authenticated: false,
  username: '',
  email: '',
  role: 'user',
  exp: 0,
};

const Context = React.createContext<UserProviderState>({
  user: EmptyUser,
  setUser: () => null,
});

export const useUser = () => useContext(Context);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(EmptyUser);
  const state = { user, setUser };
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export interface AuthProps {
  role?: Role;
  fallback: React.ReactElement;
}
export const IsAuth: React.FC<AuthProps> = ({ children, fallback, role }) => {
  const { user } = useUser();
  if (!user.authenticated || (role && role !== user.role)) return fallback;
  return <>{children}</>;
};
