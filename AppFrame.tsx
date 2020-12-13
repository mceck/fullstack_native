import React, { useEffect, useState } from 'react';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setAccessToken, User, useUser } from './authentication';
import { API_URL } from './constants';
import jwtDecode from 'jwt-decode';
import { Text, View } from 'react-native';

export const AppFrame = () => {
  const colorScheme = useColorScheme();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(`${API_URL}/api/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await result.json();
        if (data.ok && data.token) {
          setAccessToken(data.token);
          const user = jwtDecode<User>(data.token);
          user.authenticated = true;
          setUser(user);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);
  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );

  return (
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </SafeAreaProvider>
  );
};
