import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { For, Show, createMemo, createSignal } from "solid-js";
import { PageHeader } from "~/components/layout/PageHeader";
import { CaretUp, ChatCircleDots, Funnel } from "~/components/icons/Phosphor";
import { formatLastActivity } from "~/lib/utils";
import { Link } from "@tanstack/solid-router";
import * as Select from "@kobalte/core/select";
import * as Pagination from "@kobalte/core/pagination";
import { z } from "zod";
import type { Component, JSX } from "solid-js";
import type { ForumPost } from "~/lib/types";

// --- Data, Types, and Helper Functions ---

const categories = [
  "All",
  "Events",
  "Discussion",
  "How To",
  "Showcase",
  "Feedback",
] as const;
const sortOptions = [
  "Latest Activity",
  "Newest",
  "Oldest",
  "Most Upvotes",
  "Most Comments",
] as const;
const allTags = [
  "blue-and-white",
  "celadon",
  "glazing",
  "technique",
  "history",
  "modern-art",
  "exhibition",
  "question",
];

type Category = (typeof categories)[number];
type SortOption = (typeof sortOptions)[number];

// Mock Data
const now = new Date("2025-08-21T10:26:00-07:00");
const allPosts: ForumPost[] = [
  {
    id: 1,
    title: "Glazing Techniques Summit Next Month!",
    authorNickname: "Admin",
    authorAvatarUrl: "https://placehold.co/40x40/E2E8F0/4A5568?text=A",
    tags: [
      { id: 1, name: "exhibition" },
      { id: 2, name: "technique" },
    ],
    categoryName: "Events",
    upvotes: 128,
    comments: 42,
    createdAt: "2025-08-20T11:00:00Z",
    lastActivityAt: "2025-08-21T17:15:00Z",
    isPinned: true,
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 2,
    title: "Help Identifying This Mark",
    authorNickname: "L. Chen",
    authorAvatarUrl: "https://placehold.co/40x40/fef2f2/991b1b?text=L",
    tags: [
      { id: 3, name: "history" },
      { id: 4, name: "question" },
    ],
    categoryName: "Discussion",
    upvotes: 15,
    comments: 8,
    createdAt: "2025-08-21T10:00:00Z",
    lastActivityAt: "2025-08-21T16:30:00Z",
    isPinned: false,
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    id: 3,
    title: "Showcase: My First Celadon Piece",
    authorNickname: "D. Miller",
    authorAvatarUrl: "https://placehold.co/40x40/eff6ff/3730a3?text=D",
    tags: [
      { id: 1, name: "exhibition" },
      { id: 2, name: "technique" },
    ],
    categoryName: "Showcase",
    upvotes: 88,
    comments: 19,
    createdAt: "2025-08-20T09:00:00Z",
    lastActivityAt: "2025-08-21T15:05:00Z",
    isPinned: false,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    title: "How To: Properly Wedge Clay for Throwing",
    authorNickname: "ClayMaster",
    authorAvatarUrl: "https://placehold.co/40x40/f0fdf4/166534?text=C",
    tags: [{ id: 2, name: "technique" }],
    categoryName: "How To",
    upvotes: 250,
    comments: 67,
    createdAt: "2025-07-15T12:00:00Z",
    lastActivityAt: "2025-08-20T22:10:00Z",
    isPinned: false,
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 5,
    title: "Feedback on the New Portfolio Layout",
    authorNickname: "Jane",
    authorAvatarUrl: "https://placehold.co/40x40/fefce8/854d0e?text=J",
    tags: [],
    categoryName: "Feedback",
    upvotes: 5,
    comments: 2,
    createdAt: "2024-06-10T18:00:00Z",
    lastActivityAt: "2025-08-19T11:00:00Z",
    isPinned: false,
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  // ... add more posts for pagination
];

// --- Route Definition with Search Param Validation ---

const forumSearchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  category: z.enum(categories).default("All").catch("All"),
  sort: z.enum(sortOptions).default("Latest Activity").catch("Latest Activity"),
  q: z.string().optional(),
  tags: z.boolean().optional(),
});

export const Route = createFileRoute()({
  validateSearch: (search) => forumSearchSchema.parse(search),
  component: ForumPage,
});

// --- Main Page Component ---

function ForumPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const postsPerPage = 10;

  const filteredAndSortedPosts = createMemo(() => {
    let posts = [...allPosts.filter((p) => !p.isPinned)];
    const query = searchParams().q?.toLowerCase();
    const category = searchParams().category;
    const sort = searchParams().sort;

    // Filter by category
    if (category && category !== "All") {
      posts = posts.filter((p) => p.category === category);
    }
    // Filter by search query
    if (query) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query)),
      );
    }
    // Sort
    switch (sort) {
      case "Newest":
        posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "Oldest":
        posts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "Most Upvotes":
        posts.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "Most Comments":
        posts.sort((a, b) => b.comments - a.comments);
        break;
      case "Latest Activity":
      default:
        posts.sort(
          (a, b) =>
            new Date(b.lastActivityAt).getTime() -
            new Date(a.lastActivityAt).getTime(),
        );
        break;
    }
    return posts;
  });

  const paginatedPosts = createMemo(() => {
    const page = searchParams().page;
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    return filteredAndSortedPosts().slice(start, end);
  });

  const totalPages = createMemo(() =>
    Math.ceil(filteredAndSortedPosts().length / postsPerPage),
  );

  return (
    <div class="bg-gray-50 min-h-full">
      <PageHeader
        title="Forum"
        subtitle="Connect with fellow ceramic enthusiasts, share your work, and ask questions."
      />
      <div class="forum-layout">
        <Sidebar />
        <MainContent posts={paginatedPosts()} totalPages={totalPages()} />
      </div>
    </div>
  );
}

// --- Sub-Components ---

const Sidebar: Component = () => {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleCategoryClick = (category: Category) => {
    navigate({ search: (prev) => ({ ...prev, category, page: 1 }) });
  };

  const handleSearch = (e: Event) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    navigate({
      search: (prev) => ({ ...prev, q: value || undefined, page: 1 }),
    });
  };

  const toggleTags = () => {
    navigate({ search: (prev) => ({ ...prev, tags: !prev.tags }) });
  };

  return (
    <aside class="sidebar">
      <input
        type="search"
        placeholder="Search posts..."
        class="search-bar"
        onInput={handleSearch}
        value={searchParams().q || ""}
      />

      <div class="sidebar-section">
        <button class="sidebar-title-button" onClick={toggleTags}>
          TAGS
        </button>
        <Show when={searchParams().tags}>
          <div class="tag-cloud">
            <For each={allTags}>
              {(tag) => <button class="tag">{tag}</button>}
            </For>
          </div>
        </Show>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">CATEGORIES</h3>
        <div class="category-list">
          <For each={categories}>
            {(cat) => (
              <button
                class="category-button"
                data-active={searchParams().category === cat}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            )}
          </For>
        </div>
      </div>
    </aside>
  );
};

const MainContent: Component<{ posts: ForumPost[]; totalPages: number }> = (
  props,
) => {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleSortChange = (sort: SortOption | null) => {
    if (sort) {
      navigate({ search: (prev) => ({ ...prev, sort, page: 1 }) });
    }
  };

  const handlePageChange = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  const pinnedPosts = allPosts.filter((p) => p.isPinned);

  return (
    <main class="main-content">
      <div class="filter-bar">
        <span class="post-count">{props.posts.length} results</span>
        <Select.Root<SortOption>
          options={[...sortOptions]}
          value={searchParams().sort}
          onChange={handleSortChange}
          itemComponent={(props) => (
            <Select.Item item={props.item} class="select-item">
              <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            </Select.Item>
          )}
        >
          <Select.Trigger class="select-trigger">
            <Select.Value<SortOption>>
              {(state) => state.selectedOption()}
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="select-content">
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div class="post-list">
        {/* Pinned Posts */}
        <For each={pinnedPosts}>
          {(post) => <PostListItem post={post} isPinned={true} />}
        </For>

        {/* Regular Posts */}
        <For each={props.posts}>{(post) => <PostListItem post={post} />}</For>
      </div>

      <Show when={props.totalPages > 1}>
        <Pagination.Root
          class="pagination"
          count={props.totalPages}
          page={searchParams().page}
          onPageChange={handlePageChange}
          itemComponent={(props) => (
            <Pagination.Item page={props.page} class="page-item">
              {props.page}
            </Pagination.Item>
          )}
          ellipsisComponent={() => (
            <Pagination.Ellipsis class="page-ellipsis">...</Pagination.Ellipsis>
          )}
        >
          <Pagination.Previous class="page-prev">Prev</Pagination.Previous>
          <Pagination.Next class="page-next">Next</Pagination.Next>
        </Pagination.Root>
      </Show>
    </main>
  );
};

const PostListItem: Component<{ post: ForumPost; isPinned?: boolean }> = (
  props,
) => {
  return (
    <div class="post-item" data-pinned={props.isPinned}>
      <div class="post-votes">
        <CaretUp size={20} />
        <span>{props.post.upvotes}</span>
      </div>
      <div class="post-main">
        <Link
          to="/forum/$postId"
          params={{ postId: props.post.id }}
          class="post-title-link"
        >
          {props.isPinned && <span class="pinned-badge">PINNED</span>}
          {props.post.title}
        </Link>
        <div class="post-tags">
          <For each={props.post.tags}>
            {(tag) => <span class="post-tag">{tag}</span>}
          </For>
        </div>
      </div>
      <div class="post-author">
        <img
          src={props.post.authorAvatarUrl}
          alt={`${props.post.authorNickname}'s avatar`}
          class="author-avatar"
        />
      </div>
      <div class="post-comments">
        <ChatCircleDots size={18} />
        <span>{props.post.comments}</span>
      </div>
      <div class="post-activity">
        {formatLastActivity(props.post.lastActivityAt)}
      </div>
    </div>
  );
};
