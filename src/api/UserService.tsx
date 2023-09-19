import axios from 'axios';
import {IUser} from '../models/IUser';
import supabase from '../supabase/supabaseClient';
import UploadService from './UploadService';

async function updateUserInfo({name, udid}: {name: string; udid: string}) {
  try {
    const {data, error} = await supabase
      .from('users')
      .insert([{id: udid, name}]);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchUserByName({search}: {search: string}): Promise<IUser[]> {
  try {
    if (search) {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .textSearch('name', `${search}:*`)
        .limit(9);
      if (error) {
        throw error;
      }
      return data || [];
    }
    return [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchUserById({id}: {id: string}): Promise<IUser[]> {
  try {
    const {data, error} = await supabase.from('users').select('*').eq('id', id);
    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function uploadUserAvatar({
  imageUri,
  udid,
}: {
  imageUri: string;
  udid: string;
}) {
  try {
    const resUploadImage = await UploadService.uploadImage(
      imageUri,
      udid,
      'avatar',
    );
    const resUpdateDb = await supabase
      .from('users')
      .update({
        avatar: resUploadImage.imageUrl,
      })
      .eq('id', udid)
      .select();
    if (resUpdateDb.error) {
      throw resUpdateDb.error;
    }
    return resUpdateDb.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios request failed',
        error.response?.data,
        error.toJSON(),
      );
    } else {
      console.error(error);
    }
    throw error;
  }
}

const UserService = {
  updateUserInfo,
  fetchUserByName,
  fetchUserById,
  uploadUserAvatar,
};

export default UserService;
