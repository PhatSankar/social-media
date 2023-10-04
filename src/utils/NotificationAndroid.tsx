import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

function showLocalNotification(message: FirebaseMessagingTypes.RemoteMessage) {
  PushNotification.localNotification({
    channelId: 'phat_lam',
    title: message.notification?.title,
    message: message.notification?.body ?? '',
  });
}

export {showLocalNotification};
