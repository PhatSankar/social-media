import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FeedScreen from '../pages/main/FeedScreen';
import CameraScreen from '../pages/main/CameraScreen';
import ProfileScreen from '../pages/main/ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
  return <></>;
};

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="ContainerCamera"
        listeners={({navigation}) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate('Camera');
          },
        })}
        component={EmptyScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <MaterialCommunityIcons
                name="plus-box"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <MaterialCommunityIcons
                name="account-circle"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;