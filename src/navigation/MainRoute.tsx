import {createStackNavigator} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import CameraScreen from '../pages/main/CameraScreen';
import PostScreen from '../pages/main/PostScreen';
import {NavigationProp} from '@react-navigation/native';
import {IPost} from '../models/IPost';
import MessageScreen from '../pages/main/MessageScreen';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './RootNavigation';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MeetingScreen from '../pages/main/MeetingScreen';

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
  Meeting: {
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
    <BottomSheetModalProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen
          name="Meeting"
          component={MeetingScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};

export default MainRoute;
