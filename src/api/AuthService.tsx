import axios from 'axios';
import supabase from '../supabase/supabaseClient';
import UserService from './UserService';
import messaging from '@react-native-firebase/messaging';

async function signUp({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    await UserService.updateUserInfo({name, udid: data.user!.id});
    await sendFcmToken(data.user!.id);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function signIn({email, password}: {email: string; password: string}) {
  try {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    await sendFcmToken(data.user.id);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function sendFcmToken(userId: string) {
  try {
    const token = await messaging().getToken();
    const res = await axios.post('/firebase', {
      userId,
      fcmToken: token,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

async function deleteToken() {
  try {
    const token = await messaging().getToken();
    const res = await axios.delete('/firebase', {
      data: {
        fcmToken: token,
      },
    });
    await messaging().deleteToken();

    return res;
  } catch (error) {
    throw error;
  }
}

const AuthService = {
  signUp,
  signIn,
  deleteToken,
};

export default AuthService;
