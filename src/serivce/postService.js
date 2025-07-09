import {supabase} from "../libs/supabase.js";

export const createPost = async (post) => {
  const {data, error} = await supabase
    .from('posts')
    .insert([{
      title: post.title, content: post.content, user_id: post.authorId, created_at: new Date()
    }])
    .select();

  return {
    data: data?.[0] || null, error
  };
};
