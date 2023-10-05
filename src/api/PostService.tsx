import axios, {AxiosError} from 'axios';
import supabase from '../supabase/supabaseClient';
import UploadService from './UploadService';
import {IPost} from '../models/IPost';
import {IFollowing} from '../models/IFollowing';

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
      .eq('user_id', userId)
      .order('created_at', {
        ascending: false,
      });
    return data as IPost[];
  } catch (error) {
    throw error;
  }
}

async function fetchPostLength(userId: string): Promise<number | null> {
  try {
    const {data, count, error} = await supabase
      .from('posts')
      .select('*', {count: 'exact'})
      .eq('user_id', userId)
      .order('created_at', {
        ascending: false,
      });
    return count;
  } catch (error) {
    throw error;
  }
}

async function fetchPostByRange({
  userId,
  page = 0,
}: {
  userId: string;
  page: number;
}): Promise<IPost[]> {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {
        ascending: false,
      })
      .range(page * 9, (page + 1) * 9 - 1);
    if (error) {
      throw error;
    }
    return data as IPost[];
  } catch (error) {
    throw error;
  }
}

async function fetchFollowingPost(
  followingIdList: IFollowing[],
): Promise<IPost[]> {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select('*,users(name,avatar,updated_at)')
      .in('user_id', [
        ...followingIdList.map(following => following.following_id),
      ])
      .order('created_at', {
        ascending: false,
      });
    if (error) {
      throw error;
    }
    return data as IPost[];
  } catch (error) {
    throw error;
  }
}

async function fetchFollowingPostFromRange({
  followingIdList,
  page = 0,
}: {
  followingIdList: IFollowing[];
  page: number;
}): Promise<IPost[]> {
  try {
    if (followingIdList.length !== 0) {
      const {data, error, count} = await supabase
        .from('posts')
        .select('*,users(name,avatar,updated_at)')
        .in('user_id', [
          ...followingIdList.map(following => following.following_id),
        ])
        .order('created_at', {
          ascending: false,
        })
        .range(page * 8, (page + 1) * 8 - 1);
      if (error) {
        throw error;
      }
      return data as IPost[];
    }
    return [];
  } catch (error) {
    throw error;
  }
}

const PostService = {
  uploadImagePost,
  fetchPost,
  fetchFollowingPost,
  fetchFollowingPostFromRange,
  fetchPostByRange,
  fetchPostLength,
};

export default PostService;
