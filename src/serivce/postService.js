import supabase from "../libs/supabase.js";

/**
 * POST 페이지 조회
 */
export const getPosts = async (page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const {data, error, count} = await supabase
    .from('posts')
    .select('*', {count: 'exact'})
    .order('created_at', {ascending: false})
    .range(start, end);

  if (data && !error) {
    const addedPosts = await addDetailToPost(data);
    return {
      data: addedPosts,
      error,
      count
    };
  }

  return {data, error, count};
};

export const addDetailToPost = async (posts) => {
  if (!posts || posts.length === 0) return [];

  const {getUsersByNumericId} = await import('./userService');

  const userIds = [...new Set(posts.filter(post => post.user_id).map(post => post.user_id))];

  const {data: usersData} = await getUsersByNumericId(userIds);
  const usersMap = usersData ? usersData.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {}) : {};

  const addedPosts = await Promise.all(posts.map(async (post) => {
      const formattedDate = post.created_at
        ? new Date(post.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        : '날짜 정보 없음';

      const authorInfo = post.user_id ? usersMap[post.user_id] || null : null;

      return {
        ...post,
        createdAt: formattedDate,
        author: authorInfo
      };
    })
  );

  return addedPosts;
};

/**
 * Post ID 조회
 */
export const getPostById = async (id) => {
  const {data, error} = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (data && !error) {
    const [addedPost] = await addDetailToPost([data]);
    return {data: addedPost, error};
  }

  return {
    data,
    error
  };
};

/**
 * Create a new post
 * @param {Object} post - Post data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const createPost = async (post) => {
  const {data, error} = await supabase
    .from('posts')
    .insert([
      {
        title: post.title,
        content: post.content,
        user_id: post.authorId,
        created_at: new Date()
      }
    ])
    .select();

  return {
    data: data?.[0] || null,
    error
  };
};

/**
 * POST 생성
 */
export const updatePost = async (id, post) => {
  const {data, error} = await supabase
    .from('posts')
    .update({
      title: post.title,
      content: post.content
    })
    .eq('id', id)
    .select();

  return {
    data: data?.[0] || null,
    error
  };
};

/**
 * Post 삭제
 */
export const deletePost = async (id) => {
  const {error} = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  return {error};
};


/**
 * Toggle like
 */
export const togglePostLike = async (postId, userId) => {
  const {
    data: existingLike,
    error: checkError
  } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (checkError) {
    if (checkError.code !== 'PGRST116') {
      return {
        error: {
          message: 'Failed to check like status: ' + checkError.message,
          code: 'QUERY_ERROR'
        }
      };
    }
  }

  let liked = false;

  if (existingLike) {
    const {error: deleteError} = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (deleteError) {
      return {error: deleteError};
    }
  } else {
    const {error: insertError} = await supabase
      .from('post_likes')
      .insert([{
        post_id: postId,
        user_id: userId
      }]);

    if (insertError) {
      return {error: insertError};
    }
    liked = true;
  }

  const {
    count,
    error: countError
  } = await supabase
    .from('post_likes')
    .select('*', {count: 'exact'})
    .eq('post_id', postId);

  if (countError) {
    return {error: countError};
  }

  return {
    liked,
    likes: count || 0,
    error: null
  };
};
