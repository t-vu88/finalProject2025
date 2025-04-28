import React, { useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Image } from 'react-native';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { ref, get } from 'firebase/database';

const Homepage = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Kirjautumislogiikka
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Täytä molemmat kentät');
      return;
    }
    try {
      setLoading(true); // Ladataan, kun kirjautuminen on käynnissä
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        Alert.alert('Käyttäjätietoja ei löytynyt');
        setLoading(false);
        return;
      }

      const userData = snapshot.val(); // sisältää : role, teamId, code, child, email
      const isAuthorizedUser = userData.rooli === 'toimihenkilö';

      setLoading(false);

      // Navigoidaan eteenpäin TeamScreeniin ja annetaan tarvittavat parametrit
      navigation.reset({// Käyttäjä ei voi palata edellisiin näyttöihin, ellei kirjaudu ulos. 
        index: 0, // Määritetään 'TeamHomepage' ensimmäiseksi näytöksi pinossa
        routes: [{
          name: 'TeamHomepage',  // Näyttö, johon navigoidaan kirjautumisen jälkeen
          params: {
            teamId: userData.joukkue_id,
            role: userData.rooli,
            code: userData.koodi,
            child: userData.child,
            isAuthorizedUser,
            userId
          }
        }],
      });

    } catch (error) {
      setLoading(false);
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Image
            source={{ uri: 'https://sipoonwolf.fi/wp-content/uploads/2021/06/Otsikko2.png' }}
            style={styles.logo}
          />

          <View style={styles.introBox}>
            <Text style={styles.mainHeading}>Kaikki joukkueesi asiat yhdessä paikassa.</Text>
            <Text style={styles.subHeading}>Kirjaudu sisään ja pysy mukana</Text>
          </View>

          <View style={styles.loginContainer}>
            <TextInput
              placeholder="Sähköposti"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Salasana"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>{loading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}</Text>
            </TouchableOpacity>

            <Text style={styles.registerText}>Uusi käyttäjä? Rekisteröidy tästä.</Text>


            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rekisteröinti')}>
              <Text style={styles.buttonText}>Luo uusi käyttäjätili</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#F0AE2E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 0,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  introBox: {
    backgroundColor: '#F0AE2E',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  loginContainer: {
    width: '100%',
    padding: 5,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#fffdf5',
    borderColor: '#ccc',
    width: '100%',
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
  },
  registerText: {
    paddingTop: 20,
    textAlign: 'center',
    color: 'black'
  }
});

export default Homepage;