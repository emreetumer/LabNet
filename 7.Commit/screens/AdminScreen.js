import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import GuideScreen from './GuideScreen'; // GuideScreen'i ekliyoruz
import HomeScreen from './HomeScreen'; // Ana sayfa gibi başka bir ekran ekleyebiliriz

const Tab = createBottomTabNavigator();

const AdminScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = 'home';
          } else if (route.name === 'Kılavuz') {
            iconName = 'book';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ABC9C',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Kılavuz" component={GuideScreen} />
    </Tab.Navigator>
  );
};

export default AdminScreen;
