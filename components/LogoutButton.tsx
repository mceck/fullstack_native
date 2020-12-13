import { EmptyUser, setAccessToken, useUser } from '../authentication';
import { useLogoutMutation } from '../generated/graphql';
import React from 'react';
import { Button } from 'react-native';

export const LogoutButton = () => {
  const { setUser } = useUser();
  const [logout] = useLogoutMutation();
  return (
    <Button
      title="Logout"
      onPress={async () => {
        if (await logout()) {
          setAccessToken('');
          setUser(EmptyUser);
        }
      }}
    />
  );
};
