// TypeScript type definitions (User, Artwork, Post)
export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface ForumPost {
  id: number;
  authorNickname: string;
  authorAvatarUrl?: string; // Optional as it's a pointer in Go
  categoryName: string;
  title: string;
  content: string;
  isPinned: boolean;
  commentCount: number;
  likeCount: number; // This is the "upvote" count from the backend
  lastActivityAt: string; // time.Time becomes a string in JSON
  createdAt: string;
  tags: Tag[];
  // User-specific fields can be added here
}
