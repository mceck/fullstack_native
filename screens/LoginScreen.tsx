import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { setAccessToken, User, useUser } from '../authentication';
import { useLoginMutation } from '../generated/graphql';
import jwtDecode from 'jwt-decode';

export const LoginScreen: React.FC = () => {
  const { register, setValue, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [login] = useLoginMutation();
  const { setUser } = useUser();

  const onSubmit = async ({ username, password }: any) => {
    setError(null);
    const result = await login({
      variables: { username, password },
    }).catch((err) => setError(err.toString()));
    if (!result || result.errors || !result.data) return;
    const token = result.data.login.token;
    setAccessToken(token);
    const user = jwtDecode<User>(token);
    user.authenticated = true;
    setUser(user);
    // TODO refresh navigator
  };

  useEffect(() => {
    register('username');
    register('password');
  }, [register]);
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <TextInput
        onChangeText={(val) => setValue('username', val)}
        autoCapitalize="none"
        placeholder="Username"
        textContentType="username"
      />
      <TextInput
        onChangeText={(val) => setValue('password', val)}
        autoCapitalize="none"
        placeholder="Password"
        textContentType="password"
        secureTextEntry
      />
      <Button title="submit" onPress={handleSubmit(onSubmit)} />
      {error && <Text>Errore durante il login</Text>}
    </View>
  );
};
