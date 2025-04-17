import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const TeamScreen = ({ route, navigation }) => {
  const { joukkue_id, rooli, koodi, isAuthorizedUser } = route.params;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Olet kirjautunut ulos!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Kotisivu' }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image
          source={{ uri: 'https://sipoonwolf.fi/wp-content/uploads/2021/06/Otsikko2.png' }}
          style={{ width: 160, height: 50, resizeMode: 'contain' }}
        />
      ),
      headerTitle: '', 
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
          <Text style={styles.logoutText}>Kirjaudu ulos</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#F0AE2E', // Change to whatever color you like
        elevation: 0, // Optional: Remove shadow (if you don’t like the default header shadow on Android)
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>

      {/* Rooliboksi heti headerin alla vasemmalla */}
      <View style={styles.roleBox}>
        <Text style={styles.roleText}>Olet {rooli}</Text>
      </View>

      {/* Tervetuloa-teksti */}
      <Text style={styles.welcomeText}>Tervetuloa {joukkue_id} -joukkueeseen!</Text>

      {/* Painikkeet */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tapahtumat', { joukkue_id })}
      >
        <Text style={styles.buttonText}>Katso tapahtumat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Chat', { joukkue_id })}
      >
        <Text style={styles.buttonText}>Avaa joukkueen chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Kirpputori', { joukkue_id })}
      >
        <Text style={styles.buttonText}>Siirry kirpputorille</Text>
      </TouchableOpacity>

      {/* Admin-painike */}
      {isAuthorizedUser && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('Tapahtumat', { joukkue_id })}
        >
          <Text style={styles.adminButtonText}>Lisää tai muokkaa tapahtumia</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Light gray background for the body
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // A blue color for contrast
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // White text for better readability on the button
  },
  adminButton: {
    marginTop: 30,
    backgroundColor: '#D7263D', // Red for the admin button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0', // Light gray background for the role box
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
    marginLeft: -10,
    marginBottom:20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});



export default TeamScreen;
