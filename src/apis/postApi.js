import { supabase } from "../libs/supabase";

export const fetchPosts = async (page = 1, limit = 20) => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase 환경 변수를 설정해주세요. (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
    );
  }

  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("posts")
    .select(
      `
      id, title, content, created_at,
      users(email)
    `
    )
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);
    // SELECT posts.id, posts.title, posts.content, posts.created_at, users.email
    // FROM posts
    // JOIN users ON posts.user_id = users.id
    // ORDER BY posts.id DESC
    // LIMIT 20
    // OFFSET 0;

  if (error) {
    throw new Error(error.message);
  }

  return {
    posts: data ?? [],
    totalCount: count ?? 0,
  };
};
