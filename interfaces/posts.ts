export interface Post {
  id: string;
  userId: string;
  text: string;
  likes: number;
  likedBy: string[];
}
