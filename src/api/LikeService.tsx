import supabase from '../supabase/supabaseClient';

async function updateLikePost(postId: string, userId: string) {
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
    // throw error;
  }
}

const LikeService = {
  updateLikePost,
};

export default LikeService;
