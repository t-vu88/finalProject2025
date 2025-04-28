import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const RegisterPage = () => {
  const navigation = useNavigation();

  // Tilamuuttujat käyttäjän syötteille
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [childName, setChildName] = useState(''); 

  // yläpalkin ulkoasu ja logo
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={{ uri: 'https://sipoonwolf.fi/wp-content/uploads/2021/06/Otsikko2.png' }}
          style={{ width: 160, height: 50, resizeMode: 'contain' }}
        />
      ),
      headerLeft: null,
      headerStyle: {
        backgroundColor: '#F0AE2E',
      },
      headerTintColor: 'black',
    });
  }, [navigation]);

  // rekisteröitymisen käsitteleminen
  const handleRegister = async () => {
    // Tarkista että kaikki kentät on täytetty
    if (!email || !password || !registerCode || !childName) {
      Alert.alert('Täytä kaikki kentät');
      return;
    }

    try {
      // Haetaan syötetty kutsukoodi tietokannasta
      const registerCodeRef = ref(db, `registerCode/${registerCode}`);
      const snapshot = await get(registerCodeRef);

      if (!snapshot.exists()) {
        Alert.alert('Virheellinen kutsukoodi');
        return;
      }

      // Tallennetaan kutsukoodin tiedot
      const registerCodeData = snapshot.val(); // sisältää teamId, role and code

      // Luo käyttäjätunnus Firebase Authenticationin avulla
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Tallentaa käyttäjän tiedot tietokantaan
      await set(ref(db, `users/${userId}`), {
        email: email,
        code: registerCode,
        teamId: registerCodeData.joukkue_id,
        role: registerCodeData.rooli,
        child: childName,
      });

      // Tallentaa pelaajan tiedot omaan solmuun
      await set(ref(db, `players/${registerCodeData.teamId}/${userId}`), {
        nimi: childName,
        jerseyNumber: '',  // Annetaan tyhjä arvo , jotta käyttäjä voi täyttää myöhemmin
        birthday: '',
        contactInfo:''
      });

      // Navigoidaan eteenpäin käyttäjän oman joukkueen kotisivulle
      navigation.navigate('TeamHomepage', {
        teamId: registerCodeData.teamId,
        role: registerCodeData.role,
        child: childName,
      });

      Alert.alert('Rekisteröityminen onnistui!');
    } catch (error) {
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* rekisteröitymislomake */}
      <Text style={styles.title}>Luo uusi käyttäjätili</Text>

      <Text style={styles.subtitle}>Sähköposti</Text>
      <TextInput
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Salasana</Text>
      <TextInput
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.subtitle}>Kutsukoodi</Text>
      <TextInput
        placeholder="Koodi"
        value={registerCode}
        onChangeText={setRegisterCode}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Lapsen nimi</Text> 
      <TextInput
        placeholder="Lapsen nimi"
        value={childName}
        onChangeText={setChildName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
    margin: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginBottom:20
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegisterPage;
