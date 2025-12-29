import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import UserTestsScreen from '../screens/UserTestsScreen';

const Tab = createBottomTabNavigator();

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = 'home';
          } else if (route.name === 'Ayarlar') {
            iconName = 'settings';
          } else if (route.name === 'Tahlillerim') {
            iconName = 'assignment';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ABC9C',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Tahlillerim" component={UserTestsScreen} />
      <Tab.Screen name="Ayarlar" component={UserSettingsScreen} />
    </Tab.Navigator>
  );
};

export default UserTabNavigator;
