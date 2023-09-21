import {IComment} from '../models/IComment';
import supabase from '../supabase/supabaseClient';

async function fetchComments(postId: string): Promise<IComment[]> {
  try {
    const {data, error} = await supabase
      .from('comments')
      .select('*,users(name,avatar)')
      .eq('post_id', postId)
      .order('created_at', {
        ascending: true,
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

async function uploadComment({
  postId,
  userId,
  text,
}: {
  postId: string;
  userId: string;
  text: string;
}) {
  try {
    const {data, error} = await supabase
      .from('comments')
      .insert([{user_id: userId, post_id: postId, text: text}])
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

const CommentService = {
  fetchComments,
  uploadComment,
};

export default CommentService;
