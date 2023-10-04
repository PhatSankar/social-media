import messaging from '@react-native-firebase/messaging';

async function getFCMToken() {
  let token = await messaging().getToken();
  return token;
}

const FirebaseUtils = {
  getFCMToken,
};

export default FirebaseUtils;
