export function decodeToken(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}

export function isTokenExpired(token: string) {
  if (!token) {
    return true;
  }

  const decodedToken = decodeToken(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}
