import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Image } from 'react-native';
import { auth,db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const Homepage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);  // If the user is logged in, set state
      } else {
        setIsLoggedIn(false); // If no user is logged in, set state
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }
  
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login successful');
      setIsLoggedIn(true);
  
      const userId = userCredential.user.uid;
  
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
  
      if (!snapshot.exists()) {
        Alert.alert('User not found');
        setLoading(false);
        return;
      }
  
      const userData = snapshot.val();
      const userRole = userData.rooli;
      const userKoodi = userData.koodi;
      const userTeam = userData.joukkue_id;
      const isAuthorizedUser = userRole === 'toimihenkilö';
  
      setLoading(false); // End loading after data is fetched
  
      //navigate to TeamScreen after data is set
      navigation.reset({
        index: 0,
        routes: [{
          name: 'TeamScreen',
          params: {
            joukkue_id: userTeam,
            koodi: userKoodi,
            rooli: userRole,
            isAuthorizedUser,
          }
        }],
      });
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setEmail('');           
      setPassword(''); 
      Alert.alert('Logged out successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
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

            <View>
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
                  <Text style={styles.buttonText}>Kirjaudu sisään </Text>
                </TouchableOpacity>
                <Text style ={styles.questionText}>Uusi käyttäjä? Rekisteröidy tästä.</Text>
                {/* Register Button */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rekisteröinti')}>
                  <Text style={styles.buttonText}>Luo uusi käyttäjätili</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom:0
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#F0AE2E'
  },
  innerContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'left',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop:0,
    backgroundColor:"#F0AE2E"
    
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  loginContainer: {
    width: '100%',
    padding:5
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    width: '100%',
    backgroundColor:'#fffdf5',
    borderColor:'#ccc'
  
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
  questionText: {
    paddingTop:20,
    textAlign:'center'
  }
});

export default Homepage;
