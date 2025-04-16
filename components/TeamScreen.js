import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; 

const TeamScreen = ({ route, navigation }) => {
  const { joukkue_id, rooli, koodi, isAuthorizedUser } = route.params;

  // Check if joukkue_id is defined
  useEffect(() => {
    console.log('joukkue_id:', joukkue_id);
  }, [joukkue_id]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log the user out of Firebase
      Alert.alert('You have been logged out!');
      navigation.reset({
        index: 0, // Resets the navigation stack
        routes: [{ name: 'Homepage' }],
      }); // Navigate directly to the Home screen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not log out');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Tervetuloa {joukkue_id} -tiimiin!</Text>
      <Text>Roolisi: {rooli}</Text>

      {isAuthorizedUser && (
        <TouchableOpacity onPress={() => navigation.navigate('Tapahtumat', { joukkue_id })}>
          <Text>Lisää tai muokkaa tapahtumia</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Tapahtumat', { joukkue_id })}>
        <Text>Katso tapahtumat</Text>
      </TouchableOpacity>

      {/* Add the logout button */}
      <TouchableOpacity onPress={handleLogout}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default TeamScreen;
