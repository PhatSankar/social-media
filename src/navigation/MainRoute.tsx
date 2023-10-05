import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import CameraScreen from '../pages/main/CameraScreen';
import PostScreen from '../pages/main/PostScreen';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import CommentScreen from '../pages/main/CommentScreen';
import {IPost} from '../models/IPost';
import {IUser} from '../models/IUser';
import MessageScreen from '../pages/main/MessageScreen';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StringUtils from '../utils/StringUtils';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './RootNavigation';
import {useEffect} from 'react';
import {useMutation, useQuery} from 'react-query';
import UserService from '../api/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MainStackParamList = {
  Home: undefined;
  Camera: undefined;
  Comment: {
    post: IPost;
  };
  Post: {
    imageUri: string;
  };
  Message: {
    profileId: string;
    roomId: string;
  };
};

export type MainStackNavigation = NavigationProp<MainStackParamList>;

const Stack = createStackNavigator<MainStackParamList>();

const MainRoute = () => {
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data?.roomId && remoteMessage.data.userId) {
        RootNavigation.navigate('Message', {
          profileId: remoteMessage.data.userId,
          roomId: remoteMessage.data?.roomId,
        });
      }
    });
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          const tempNoti = remoteMessage.notification;
          const lastNoti = await AsyncStorage.getItem('lastNoti');
          if (lastNoti !== remoteMessage.messageId) {
            if (remoteMessage?.data?.roomId && remoteMessage.data.userId) {
              RootNavigation.navigate('Message', {
                profileId: remoteMessage.data.userId,
                roomId: remoteMessage.data?.roomId,
              });
              await AsyncStorage.setItem(
                'lastNoti',
                remoteMessage.messageId ?? '',
              );
            }
          }
        }
      });
  }, []);
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Message" component={MessageScreen} />
    </Stack.Navigator>
  );
};

export default MainRoute;
