import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminTabNavigator from './AdminTabNavigator';
import CreateGuideScreen from '../screens/CreateGuideScreen';

const Stack = createStackNavigator();

const AdminStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      <Stack.Screen name="CreateGuide" component={CreateGuideScreen} />
    </Stack.Navigator>
  );
};

export default AdminStackNavigator;
