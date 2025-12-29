import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import UsersScreen from '../screens/UsersScreen';
import TestScreen from '../screens/TestScreen';
import FastTestScreen from '../screens/FastTestScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Ana Sayfa':
              iconName = 'home';
              break;
            case 'Kılavuz':
              iconName = 'book';
              break;
            case 'Kullanıcılar':
              iconName = 'people';
              break;
            case 'Tahlil Ekle':
              iconName = 'add-circle';
              break;
            case 'Hızlı Tahlil':
              iconName = 'speed';
              break;
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ABC9C',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Tahlil Ekle" component={TestScreen} />
      <Tab.Screen name="Hızlı Tahlil" component={FastTestScreen} />
      <Tab.Screen name="Kullanıcılar" component={UsersScreen} />
      <Tab.Screen name="Kılavuz" component={GuideScreen} />
      
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
