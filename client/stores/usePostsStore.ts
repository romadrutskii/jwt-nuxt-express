/* export default defineStore('posts', () => {
  const accessTokenCookie = useStatefulCookie<string | null>('accessToken');
  const { notify } = useNotifications();

  const posts = ref<null | Post[]>([]);
  const isLoading = ref(false);

  async function getPosts() {
    isLoading.value = true;
    const { data, error } = await usePostsFetch('posts', {
      method: 'GET',
      server: true,
      headers: {
        Authorization: `Bearer ${accessTokenCookie.value}`,
      },
    });
    isLoading.value = false;

    if (error.value) {
      notify({
        type: 'error',
        message: error.value.data.error,
      });
      return;
    }

    if (data.value) {
      posts.value = data.value;
    }
  }

  function clearState() {
    posts.value = null;
  }

  return { getPosts, posts, isLoading, clearState };
});
 */
