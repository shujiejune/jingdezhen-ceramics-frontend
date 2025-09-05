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

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export type ContentBlockType = "video" | "reading" | "assignment" | "quiz";

export interface ContentBlock {
  id: number;
  type: ContentBlockType;
  title: string;
  duration?: string; // e.g., "03:52"
  isPreviewable?: boolean;
  videoUrl?: string;
}

export interface Announcement {
  id: number;
  authorNickname: string;
  authorAvatarUrl?: string;
  createdAt: string;
  content: string;
}

export interface CourseChapter {
  id: number;
  title: string;
  contentBlocks: ContentBlock[];
}

export interface Course {
  id: number;
  title: string;
  instructorName: string;
  lastUpdatedAt: string; // ISO Date String
  language: string;
  thumbnailUrl: string;
  description: string;
  chapters: CourseChapter[];
  announcements?: Announcement[];
  userNotes?: Note[];
}

export interface PortfolioWork {
  id: number;
  userId: string;
  creatorNickname: string;
  creatorAvatarUrl: string; // Added for the UI
  title: string;
  description?: string;
  isEditorsChoice: boolean;
  upvotesCount: number;
  createdAt: string;
  updatedAt: string; // ISO 8601 string
  thumbnailUrl: string;
  images?: PortfolioWorkImage[];
  tags: Tag[];
  upvotedByMe: boolean;
  savedByMe: boolean;
}

export interface PortfolioWorkImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  caption: string;
  displayOrder: number;
}
