export default async (request, opts?) => {
  const cookie = useCookie('accessToken');
  const { notify } = useNotifications();

  return useFetch(request, {
    baseURL: 'http://localhost:3000/',
    onRequest({ request, options }) {
      const accessToken = cookie.value;
      if (accessToken) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        notify({
          type: 'error',
          message: 'Sorry, you have to be logged in for viewing this page.',
        });
      }
    },
    ...opts,
  });
};
