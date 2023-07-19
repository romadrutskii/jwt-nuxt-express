import { Post } from 'interfaces';

export default function usePostsApi() {
  const token = useStatefulCookie<string | null>('accessToken');
  const baseUrl = computed(
    () => (process.server ? process.env.POSTS_API_URL : 'api') + '/posts'
  );

  const getPostsByUserId = async (userId: string, opts?: any) => {
    const { data, pending, error, refresh } = await useFetch<Post[]>(
      `${baseUrl.value}?userId=${userId}`,
      opts
    );
    return { data, pending, error, refresh };
  };

  const getPostsByUsername = async (username: string, opts?: any) => {
    const { data, pending, error, refresh } = await useFetch(
      `${baseUrl.value}/${username}`,
      opts
    );
    return { data, pending, error, refresh };
  };

  const addPost = async (text: string, opts?: any) => {
    const { data, execute, pending, error } = await useFetch(
      `${baseUrl.value}`,
      {
        method: 'POST',
        body: { text },
        headers: token.value
          ? { Authorization: `Bearer ${token.value}` }
          : undefined,
        ...opts,
      }
    );
    return { data, execute, pending, error };
  };

  const editPost = async (id: string, text: string, opts?: any) => {
    const { execute, pending, error } = await useFetch(
      `${baseUrl.value}/${id}`,
      {
        method: 'PUT',
        body: { text },
        headers: token.value
          ? { Authorization: `Bearer ${token.value}` }
          : undefined,
        ...opts,
      }
    );
    return { execute, pending, error };
  };

  const deletePost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await useFetch(
      `${baseUrl.value}/${id}`,
      {
        method: 'DELETE',
        headers: token.value
          ? { Authorization: `Bearer ${token.value}` }
          : undefined,
        ...opts,
      }
    );
    return { execute, pending, error };
  };

  const addLikeToPost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await useFetch(
      `${baseUrl.value}/${id}/like`,
      {
        method: 'POST',
        headers: token.value
          ? { Authorization: `Bearer ${token.value}` }
          : undefined,
        ...opts,
      }
    );
    return { execute, pending, error };
  };

  const removeLikeFromPost = async (id: string, opts?: any) => {
    const { execute, pending, error } = await useFetch(
      `${baseUrl.value}/${id}/like`,
      {
        method: 'DELETE',
        headers: token.value
          ? { Authorization: `Bearer ${token.value}` }
          : undefined,
        ...opts,
      }
    );
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
