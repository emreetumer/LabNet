import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import GuideScreen from '../screens/GuideScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = 'home';
          } else if (route.name === 'Kılavuz') {
            iconName = 'book';
          } else if (route.name === 'Kullanıcılar') {
            iconName = 'people';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ABC9C',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Kılavuz" component={GuideScreen} />
      <Tab.Screen name="Kullanıcılar" component={UsersScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
