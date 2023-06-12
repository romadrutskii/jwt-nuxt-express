import useAuthStore from '~/stores/auth';
import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const exceptions = ['/login', '/register'];

  const { notify } = useNotifications();
  const authStore = useAuthStore();
  const cookie = useCookie('accessToken');
  const { getCurrentUser } = authStore;
  const { isLoggedIn } = storeToRefs(authStore);

  if (exceptions.includes(to.fullPath)) {
    return;
  }

  if (cookie.value) {
    await getCurrentUser();
  }

  if (!isLoggedIn.value) {
    notify({
      type: 'error',
      message: 'You need to log in.',
    });
    return navigateTo('/login');
  }
});
