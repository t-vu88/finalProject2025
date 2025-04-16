import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDatabase, ref, get } from 'firebase/database';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // In LoginScreen.js

const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Täytä sähköposti ja salasana');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      // Get the user's data (including koodi, joukkue_id, rooli)
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
  
      if (!snapshot.exists()) {
        Alert.alert('User not found');
        return;
      }
  
      const userData = snapshot.val();
      const userRole = userData.rooli;
      const userKoodi = userData.koodi; 
      const userTeam = userData.joukkue_id;
      const isAuthorizedUser = userRole === 'toimihenkilö';  
  
      // Navigate to the team screen with relevant information (team and role)
      navigation.navigate('TeamScreen', { team: userTeam, koodi: userKoodi, rooli: userRole, isAuthorizedUser });
    } catch (error) {
      console.error(error);
      Alert.alert('Virhe kirjautumisessa', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirjaudu sisään</Text>
      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Kirjaudu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default LoginScreen;
