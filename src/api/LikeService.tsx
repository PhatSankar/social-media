import supabase from '../supabase/supabaseClient';

async function insertikePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const {data, error} = await supabase
      .from('likes')
      .insert([
        {
          post_id: postId,
          user_id: userId,
        },
      ])
      .select();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteikePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const {data, error} = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchIsLike(postId: string, userId: string) {
  try {
    const {data, error} = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .limit(1);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const LikeService = {
  insertikePost,
  deleteikePost,
  fetchIsLike,
};

export default LikeService;
