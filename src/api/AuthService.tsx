import supabase from '../supabase/supabaseClient';
import UserService from './UserService';

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
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const AuthService = {
  signUp,
  signIn,
};

export default AuthService;
