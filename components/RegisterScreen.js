// components/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !inviteCode) {
      Alert.alert('Täytä kaikki kentät');
      return;
    }

    try {
      // Check invite code in Realtime Database
      const inviteRef = ref(db, `team_invites/${inviteCode}`);
      const snapshot = await get(inviteRef);

      if (!snapshot.exists()) {
        Alert.alert('Virheellinen kutsukoodi');
        return;
      }

      const inviteData = snapshot.val(); // contains teamId and role
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save user to /users
      await set(ref(db, `users/${userId}`), {
        email: email,
        teamId: inviteData.teamId,
        role: inviteData.role,
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
      <TextInput placeholder="Kutsukoodi" value={inviteCode} onChangeText={setInviteCode} style={styles.input} />
      <Button title="Rekisteröidy" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
});

export default RegisterScreen;
