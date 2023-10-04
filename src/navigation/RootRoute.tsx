import {View, Text, ActivityIndicator, Button} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../pages/auth/LoginScreen';
import SignUpScreen from '../pages/auth/SignUpScreen';
import {AuthContext} from '../context/AuthContext';
import MainRoute from './MainRoute';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootRoute = () => {
  const {user, isLoading, logout} = useContext(AuthContext);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  if (user !== null) {
    return <MainRoute />;
  }
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootRoute;
