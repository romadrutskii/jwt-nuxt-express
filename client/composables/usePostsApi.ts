import { IPost } from 'interfaces';

export default function usePostsApi() {
  const runtimeConfig = useRuntimeConfig();
  const fetchPosts = <T>(url: string, opts?: any) =>
    useFetch<T>(url, {
      baseURL: runtimeConfig.public.postsApiBase,
      ...opts,
    });
  const token = useStatefulCookie<string | null>('accessToken');

  const getPostsByUserId = async (userId: string, opts?: any) => {
    const { data, pending, error, refresh } = await fetchPosts<IPost[]>(
      `posts?userId=${userId}`,
      opts
    );
    return { data, pending, error, refresh };
  };

  const getPostsByUsername = async (username: string, opts?: any) => {
    const { data, pending, error, refresh } = await fetchPosts(
      `posts/${username}`,
      opts
    );
    return { data, pending, error, refresh };
  };

  const addPost = async (text: string, opts?: any) => {
    const { execute, pending, error } = await fetchPosts('posts', {
      method: 'POST',
      body: { text },
      headers: token.value
        ? { Authorization: `Bearer ${token.value}` }
        : undefined,
      ...opts,
    });
    return { execute, pending, error };
  };

  const editPost = async (id: string, text: string, opts?: any) => {
    const { execute, pending, error } = await fetchPosts(`posts/${id}`, {
      method: 'PUT',
      body: { text },
      headers: token.value
        ? { Authorization: `Bearer ${token.value}` }
        : undefined,
      ...opts,
    });
    return { execute, pending, error };
  };

  const deletePost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await fetchPosts(`posts/${id}`, {
      method: 'DELETE',
      headers: token.value
        ? { Authorization: `Bearer ${token.value}` }
        : undefined,
      ...opts,
    });
    return { execute, pending, error };
  };

  const addLikeToPost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await fetchPosts(`posts/${id}/like`, {
      method: 'POST',
      headers: token.value
        ? { Authorization: `Bearer ${token.value}` }
        : undefined,
      ...opts,
    });
    return { execute, pending, error };
  };

  const removeLikeFromPost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await fetchPosts(`posts/${id}/like`, {
      method: 'DELETE',
      headers: token.value
        ? { Authorization: `Bearer ${token.value}` }
        : undefined,
      ...opts,
    });
    return { execute, pending, error };
  };

  return {
    getPostsByUserId,
    getPostsByUsername,
    addPost,
    editPost,
    deletePost,
    addLikeToPost,
    removeLikeFromPost,
  };
}
