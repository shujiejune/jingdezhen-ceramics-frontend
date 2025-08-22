// TypeScript type definitions (User, Artwork, Post)
export interface Tag {
  id: number;
  name: string;
}

export interface ForumPost {
  id: number;
  authorNickname: string;
  authorAvatarUrl?: string; // Optional as it's a pointer in Go
  categoryName: string;
  title: string;
  content: string;
  isPinned: boolean;
  comments: number;
  upvotes: number; // This is the "upvote" count from the backend
  lastActivityAt: string; // time.Time becomes a string in JSON
  createdAt: string;
  tags: Tag[];
  // User-specific fields can be added here
}
