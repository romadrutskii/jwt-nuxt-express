export interface Post {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  author: User;
  authorId: string;
  likes: Like[];
  likeCount: number;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  password: string;
  posts: Post[];
  likes: Like[];
}

export interface Like {
  id: string;
  createdAt: string;
  user: User;
  userId: string;
  post: Post;
  postId: string;
}

export interface RefreshToken {
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
}
