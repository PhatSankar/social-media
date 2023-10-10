/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import 'react-native-url-polyfill/auto';
import React, {useEffect} from 'react';
import RootRoute from './src/navigation/RootRoute';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AuthProvider} from './src/context/AuthContext';
import {setupAxios} from './src/utils/AxiosUtils';
import axios from 'axios';
import FirebaseUtils from './src/utils/FirebaseUtils';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {showLocalNotification} from './src/utils/NotificationAndroid';
import {navigationRef} from './src/navigation/RootNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const queryClient = new QueryClient();
setupAxios(axios);

function App(): JSX.Element {
  useEffect(() => {
    FirebaseUtils.getFCMToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showLocalNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <RootRoute />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
