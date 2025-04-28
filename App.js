import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper'; // React Native Paper provider

import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import TeamHomepage from './components/TeamHomepage';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Kotisivu">
          <Stack.Screen name="Kotisivu" component={HomePage} />
          <Stack.Screen name="Rekisteröinti" component={RegisterPage} />
          <Stack.Screen name="TeamHomepage" component={TeamHomepage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;