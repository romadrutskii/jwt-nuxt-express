export default async (request, opts?) => {
  const accessTokenCookie = useStatefulCookie<string | null>('accessToken');

  return useFetch(request, {
    baseURL: 'http://localhost:3000/',
    headers: {
      Authorization: `Bearer ${accessTokenCookie.value}`,
    },
    ...opts,
  });
};
