// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AdminStackNavigator from './navigators/AdminStackNavigator'; // Admin için Stack Navigasyonu
import UserTabNavigator from './navigators/UserTabNavigator'; // User için alt bar navigasyonu

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Giriş ekranları */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        
        {/* Kullanıcı rolleri için navigasyonlar */}
        <Stack.Screen name="Admin" component={AdminStackNavigator} />
        <Stack.Screen name="User" component={UserTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
