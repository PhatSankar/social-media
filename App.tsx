/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import 'react-native-url-polyfill/auto';
import React from 'react';
import RootRoute from './src/navigation/RootRoute';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AuthProvider} from './src/context/AuthContext';

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <RootRoute />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
