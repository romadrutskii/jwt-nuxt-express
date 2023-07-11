# JWT authentication

## Description

The server returns accessToken (expired in 15s) and refreshToken. A client's auth middleware is making sure that its accessToken is not expired, and if it is, gets a new one from the server. It also uses cookies and fetches current logged in user if the page was refreshed, so user's workflow is smooth.

## Setup

Make sure to install the dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

## authServer.js endpoints:

### POST /register

- Description: Register a new user.
- Request body:
  - `username` (string): The username of the new user.
  - `password` (string): The password of the new user.
- Response:
  - 201: User successfully registered.
  - 400: Username already taken.

### POST /login

- Description: Log in an existing user.
- Request body:
  - `username` (string): The username of the user.
  - `password` (string): The password of the user.
- Response:
  - 200: User successfully logged in. Returns an access token and a refresh token.
  - 401: Invalid username or password.

### GET /user

- Description: Get the authenticated user's information.
- Headers:
  - `Authorization`: Bearer token (access token).
- Response:
  - 200: Returns the authenticated user's information.
  - 401: You are not authorized. Please, log in.
  - 403: You are not authorized. Please, log in.

### POST /refresh-token

- Description: Refresh the access token.
- Request body:
  - `refreshToken` (string): The refresh token.
- Response:
  - 200: Returns a new access token.
  - 401: Invalid refresh token.

### POST /logout

- Description: Log out the user.
- Request body:
  - `refreshToken` (string): The refresh token.
- Response:
  - 204: User successfully logged out.
  - 401: You are not logged in.

---

Start the development server on `http://localhost:3001`

```bash
cd server
nodemon authServer.js
```

## postsServer.js endpoints:

### GET /posts

- Description: Get the authenticated user's posts.
- Headers:
  - `Authorization`: Bearer token (access token).
- Response:
  - 200: Returns an array of posts created by the authenticated user.
  - 401: You are not authorized. Please, log in.
  - 403: You are not authorized. Please, log in.

---

Start the development server on `http://localhost:3000`

```bash
cd server
nodemon postsServer.js
```

## Client is build using Nuxt 3

```bash
cd client
```

Firstly, you need to set up the environment variables:

```bash
CLIENT_PORT=5173
```

Start the development server on `http://localhost:5173`

```bash
npm run dev
```
