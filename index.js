/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification, {Importance} from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';



PushNotification.configure({
    onNotification: function (notification) {

      },

    onRegistrationError: function(err) {
        console.error(err.message, err);
    },
    
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    popInitialNotification: true,

    requestPermissions: true,

})

PushNotification.createChannel(
    {
      channelId: "phat_lam", // (required)
      channelName: "Channel noti", // (required)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
