import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useUserQuery } from '../generated/graphql';

import { Text, View } from '../components/Themed';

export default function TabOneScreen() {
  const { loading, data } = useUserQuery();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>
          username: {data?.myUser.username}, email: {data?.myUser.email}, role:{' '}
          {data?.myUser.role}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
