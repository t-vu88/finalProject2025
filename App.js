import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Use native-stack instead
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EventScreen from './components/EventScreen'; // Your main screen after login

const Stack = createNativeStackNavigator(); // Create native stack navigator

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Tapahtumat" component={EventScreen} /> {/* Replace HomeScreen with actual component */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
