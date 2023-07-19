interface User {
  id: string;
  username: string;
}

export default defineStore('auth', () => {
  const { notify } = useNotifications();
  const accessTokenCookie = useStatefulCookie<string | null>('accessToken');
  const refreshTokenCookie = useCookie<string | null>('refreshToken', {
    sameSite: true,
  });

  const currentUser = ref<null | User>(null);
  const isLoading = ref(false);
  const isLoggedIn = computed(() => !!currentUser.value);

  const baseUrl = computed(
    () => (process.server ? process.env.AUTH_API_URL : 'api') + '/auth/'
  );

  async function register(username: string, password: string) {
    isLoading.value = true;
    const { data, error } = await useFetch(baseUrl.value + 'register', {
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
    const { data, error } = await useFetch(baseUrl.value + 'login', {
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

      await navigateTo(`/${currentUser.value.username}`);
    }
  }

  async function getCurrentUser() {
    isLoading.value = true;
    const { data, error } = await useFetch(baseUrl.value + 'user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessTokenCookie.value}`,
      },
    });
    isLoading.value = false;

    if (data.value) {
      currentUser.value = {
        id: data.value.id,
        username: data.value.username,
      };
    }
  }

  async function logout() {
    isLoading.value = true;
    const { error } = await useFetch(baseUrl.value + 'logout', {
      method: 'POST',
      body: {
        refreshToken: refreshTokenCookie.value,
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

    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
    clearState();

    notify({
      type: 'success',
      message: "You've successfully logged out.",
    });
    await navigateTo('/login');
  }

  async function refreshToken() {
    isLoading.value = true;
    const { data, error } = await useFetch(baseUrl.value + 'refresh-token', {
      method: 'POST',
      body: {
        refreshToken: refreshTokenCookie.value,
      },
    });
    isLoading.value = false;

    if (data.value) {
      accessTokenCookie.value = data.value.accessToken;
      refreshTokenCookie.value = data.value.refreshToken;
    }
  }

  function clearState() {
    currentUser.value = null;
  }

  return {
    isLoggedIn,
    currentUser,
    isLoading,
    login,
    getCurrentUser,
    logout,
    register,
    refreshToken,
  };
});
