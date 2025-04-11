// components/EventScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Events</Text>
      <Text style={styles.subtitle}>This is where team events will be shown.</Text>
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center'
  }
});
