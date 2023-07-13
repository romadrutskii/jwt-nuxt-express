export interface Post {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  author: User;
  authorId: string;
  likes: Like[];
  likeCount: number;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  posts: Post[];
  likes: Like[];
}

export interface Like {
  id: string;
  createdAt: Date;
  user: User;
  userId: string;
  post: Post;
  postId: string;
}

export interface RefreshToken {
  refresh_token: string;
  createdAt: Date;
  updatedAt: Date;
}
