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
import {setupAxios} from './src/utils/AxiosUtils';
import axios from 'axios';

const queryClient = new QueryClient();
setupAxios(axios);

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
