export default async (request, opts?) => {
  return useFetch(request, {
    baseURL: "http://localhost:3001/",
    ...opts,
  });
};
