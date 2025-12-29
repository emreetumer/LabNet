import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import GuideScreen from './GuideScreen';
import HomeScreen from './HomeScreen';
import UsersScreen from './UsersScreen';
import TestScreen from './TestScreen'; // TestScreen'i içe aktardığınızdan emin olun

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
          } else if (route.name === 'Kullanıcılar') {
            iconName = 'people';
          } else if (route.name === 'Tahlil Ekle') {
            iconName = 'add-circle'; // "Tahlil Ekle" için ikon
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ABC9C',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Kılavuz" component={GuideScreen} />
      <Tab.Screen name="Kullanıcılar" component={UsersScreen} />
      <Tab.Screen name="Tahlil Ekle" component={TestScreen} /> {/* Yeni ekleme */}
    </Tab.Navigator>
  );
};

export default AdminScreen;
