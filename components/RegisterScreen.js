
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !registerCode) {
      Alert.alert('Täytä kaikki kentät');
      return;
    }

    try {
      // Check code in Realtime Database
      const registerCodeRef = ref(db, `kutsukoodi/${registerCode}`);
      const snapshot = await get(registerCodeRef);

      if (!snapshot.exists()) {
        Alert.alert('Virheellinen kutsukoodi');
        return;
      }

      const registerCodeData = snapshot.val(); // contains joukkue_id and rooli

      //create user in firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save user to /users in realtime Db
      await set(ref(db, `users/${userId}`), {
        email: email,
        joukkue_id: registerCodeData.joukkue_id,
        rooli: registerCodeData.rooli,
      });

      Alert.alert('Rekisteröityminen onnistui!');
    } catch (error) {
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröidy</Text>
      <TextInput placeholder="Sähköposti" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Koodi" value={registerCode} onChangeText={setRegisterCode} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Rekisteröidy</Text>
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
  

export default RegisterScreen;
