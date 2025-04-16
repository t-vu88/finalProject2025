import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Use native-stack instead
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import EventScreen from './components/EventScreen'; // Your main screen after login
import TeamScreen from './components/TeamScreen';
const Stack = createNativeStackNavigator(); // Create native stack navigator

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Kotisivu">
        <Stack.Screen name="Kotisivu" component={HomeScreen} />
        <Stack.Screen name="Registeröinti" component={RegisterScreen} />
        <Stack.Screen name="Tapahtumat" component={EventScreen} />
        <Stack.Screen name="Joukkueesi" component={TeamScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
