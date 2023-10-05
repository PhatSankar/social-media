import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

function showLocalNotification(message: FirebaseMessagingTypes.RemoteMessage) {
  if (message.data?.roomId && message.data?.userId) {
    PushNotification.localNotification({
      channelId: 'phat_lam',
      title: message.notification?.title,
      message: message.notification?.body ?? '',
      data: {roomId: message.data?.roomId, userId: message.data?.userId},
    });
  }
}

export {showLocalNotification};
