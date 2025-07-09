import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../libs/supabase";

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("posts")
        .select("*, users(nickname)")
        .eq("id", id)
        .single();

      if (error) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!post) return <div>게시글이 존재하지 않습니다.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="mb-2 text-gray-500">
        작성자: {post.users?.nickname || "알 수 없음"}
      </div>
      <div className="mb-6 text-sm text-gray-400">
        작성일: {new Date(post.created_at).toLocaleString()}
      </div>
      <div className="prose">{post.content}</div>
    </div>
  );
}

export default PostDetailPage;
