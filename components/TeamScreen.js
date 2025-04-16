import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; 

const TeamScreen = ({ route, navigation }) => {
  const { joukkue_id, rooli, koodi, isAuthorizedUser } = route.params;

  // käyttäjän uloskirjautuminen
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      Alert.alert('You have been logged out!');
      navigation.reset({
        index: 0, // Nollaa navigointipino
        routes: [{ name: 'Kotisivu' }],
      }); // siirty suoraan kotisivulle uloskirjautumisen jälkeen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not log out');
    }
  };

  // logOut- painike headerissä
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: 'red', marginRight: 10 }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
          source={{ uri: 'https://sipoonwolf.fi/wp-content/uploads/2021/06/Otsikko2.png' }}
          style={styles.logo}
        />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default TeamScreen;
