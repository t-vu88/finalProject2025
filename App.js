import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Use native-stack instead
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EventScreen from './components/EventScreen'; // Your main screen after login

const Stack = createNativeStackNavigator(); // Create native stack navigator

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Homepage">
      <Stack.Screen name="Homepage" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Tapahtumat" component={EventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
