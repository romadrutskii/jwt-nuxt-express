import { isTokenExpired } from '~/utils/jwt';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const exceptions = ['/login', '/register'];

  const { notify } = useNotifications();
  const authStore = useAuthStore();
  const accessTokenCookie = useStatefulCookie<string | null>('accessToken');
  const { getCurrentUser, refreshToken } = authStore;
  const { isLoggedIn, currentUser } = storeToRefs(authStore);

  if (accessTokenCookie.value && isTokenExpired(accessTokenCookie.value)) {
    await refreshToken();
  }

  if (accessTokenCookie.value && !isLoggedIn.value) {
    await getCurrentUser();
  }

  if (
    isLoggedIn.value &&
    (exceptions.includes(to.fullPath) || to.matched.length === 0) &&
    currentUser.value
  ) {
    return navigateTo(`/${currentUser.value.username}`);
  }

  if (!isLoggedIn.value && !exceptions.includes(to.fullPath)) {
    notify({
      type: 'error',
      message: 'You need to log in.',
    });
    return navigateTo('/login');
  }
});
