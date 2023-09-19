import axios, {AxiosError} from 'axios';
import supabase from '../supabase/supabaseClient';
import UploadService from './UploadService';
import {IPost} from '../models/IPost';

async function uploadImagePost({
  imageUri,
  caption,
  userId,
}: {
  imageUri: string;
  caption: string;
  userId: string;
}) {
  try {
    const resUploadImage = await UploadService.uploadImage(
      imageUri,
      userId,
      'posts',
    );
    const resInsertPost = await supabase.from('posts').insert([
      {
        user_id: userId,
        caption: caption,
        image_url: resUploadImage.imageUrl,
      },
    ]);
    if (resInsertPost.error) {
      throw resInsertPost.error;
    }
    return resInsertPost.data;
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

async function fetchPost(userId: string): Promise<IPost[]> {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId);
    return data as IPost[];
  } catch (error) {
    throw error;
  }
}

const PostService = {
  uploadImagePost,
  fetchPost,
};

export default PostService;
