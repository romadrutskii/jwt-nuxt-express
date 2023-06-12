interface User {
  username: string;
}

export default defineStore('auth', () => {
  const { notify } = useNotifications();
  const accessTokenCookie = useCookie<string | null>('accessToken');
  const refreshTokenCookie = useCookie<string | null>('refreshToken');

  const currentUser = ref<null | User>(null);
  const isLoading = ref(false);

  const isLoggedIn = computed(() => !!currentUser.value);

  async function register(username: string, password: string) {
    isLoading.value = true;
    const { data, error } = await useAuthFetch('register', {
      method: 'POST',
      body: {
        username,
        password,
      },
    });
    isLoading.value = false;

    if (error.value) {
      notify({
        type: 'error',
        message: error.value.data?.error || error.value.message || 'Error',
      });
      return;
    }

    console.log(data.value);
    if (data.value.success) {
      notify({
        type: 'success',
        message: 'You have successfully registered.',
      });

      await navigateTo('/login');
    }
  }

  async function login(username: string, password: string) {
    isLoading.value = true;
    const { data, error } = await useAuthFetch('login', {
      method: 'POST',
      body: {
        username,
        password,
      },
    });
    isLoading.value = false;

    if (error.value) {
      notify({
        type: 'error',
        message: error.value.data?.error || error.value.message || 'Error',
      });
      return;
    }

    if (data.value) {
      accessTokenCookie.value = data.value.accessToken;
      refreshTokenCookie.value = data.value.refreshToken;

      currentUser.value = {
        username,
      };

      notify({
        type: 'success',
        message: 'You have successfully logged in',
      });

      await navigateTo('/my-posts');
    }
  }

  async function getCurrentUser() {
    isLoading.value = true;
    const { data, error } = await useAuthFetch('user', {
      method: 'GET',
      onRequest({ request, options }) {
        const accessToken = accessTokenCookie.value;
        if (accessToken) {
          options.headers = options.headers || {};
          options.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          throw new Error(
            'Sorry, you have to be logged in for viewing this page.'
          );
        }
      },
    });
    isLoading.value = false;

    if (error.value) {
      const errorMessage =
        error.value instanceof Error
          ? error.value.message
          : error.value.data.error;
      notify({
        type: 'error',
        message: errorMessage,
      });
      return;
    }

    if (data.value) {
      currentUser.value = {
        username: data.value.username,
      };
    }
  }

  async function logout() {
    isLoading.value = true;
    const { data, error } = await useAuthFetch('logout', {
      method: 'POST',
      body: {
        refreshToken: refreshTokenCookie.value,
      },
    });
    isLoading.value = false;

    if (error.value) {
      const errorMessage =
        error.value instanceof Error
          ? error.value.message
          : error.value.data.error;
      notify({
        type: 'error',
        message: errorMessage,
      });
      return;
    }

    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
    notify({
      type: 'success',
      message: "You've successfully logged out.",
    });
    await navigateTo('/login');
  }

  return {
    isLoggedIn,
    currentUser,
    isLoading,
    login,
    getCurrentUser,
    logout,
    register,
  };
});
