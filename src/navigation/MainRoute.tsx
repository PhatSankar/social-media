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
    currentProfile: IUser;
    roomId: string;
  };
};

export type MainStackNavigation = NavigationProp<MainStackParamList>;

const Stack = createStackNavigator<MainStackParamList>();

const MainRoute = () => {
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        RootNavigation.navigate('Profile');
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          RootNavigation.navigate('Profile');
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
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={({route}) => ({
          headerTitle: () => (
            <View style={styles.headerContainer}>
              {route.params.currentProfile.avatar ? (
                <Image
                  resizeMethod="resize"
                  style={styles.avatar}
                  source={{
                    uri: `${StringUtils.convertUrlToLocalEmulator(
                      route.params.currentProfile.avatar,
                    )}${
                      route.params.currentProfile.updated_at
                        ? `?cache=${route.params.currentProfile.updated_at}`
                        : ''
                    }`,
                  }}
                  onError={error => {
                    console.log(error.nativeEvent);
                  }}
                />
              ) : (
                <Image
                  resizeMethod="resize"
                  style={styles.avatar}
                  source={require('../../public/images/default_ava.png')}
                />
              )}
              <Text
                style={{fontSize: wp(6), color: 'black', fontWeight: '500'}}>
                {route.params.currentProfile.name}
              </Text>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10) / 2,
    resizeMode: 'contain',
  },
});

export default MainRoute;
