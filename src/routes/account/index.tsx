import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { useQuery } from "@tanstack/solid-query";
import { For, Show, Suspense, createSignal, type Component } from "solid-js";
import { z } from "zod";
import {
  Bell,
  BookOpen,
  Notebook,
  Palette,
  Swap,
  Heart,
  BookmarkSimple,
  MagnifyingGlass,
} from "~/components/icons/Phosphor";
import {
  Notification,
  EnrolledCourse,
  Note,
  PortfolioWork,
  Artwork,
  ForumPost,
} from "~/lib/types";
import { AccountSidebar } from "~/components/layout/AccountSidebar";

// --- Mock User Data ---
const mockUser = {
  nickname: "CeramicMaster",
  avatarUrl: "https://placehold.co/100x100/d1fae5/065f46?text=CM",
};

// --- Mock Data & API Fetching ---

const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      actorUser: { id: "user-2", nickname: "ClayFan", avatarUrl: "" },
      notificationType: "comment",
      entityType: "post",
      entityId: 123,
      entityTitle: "Glazing Techniques",
      message: "replied to your post.",
      isRead: false,
      createdAt: "2025-09-17T10:30:00Z",
    },
    {
      id: 2,
      actorUser: { id: "user-3", nickname: "PotterHead", avatarUrl: "" },
      notificationType: "mention",
      entityType: "artwork",
      entityId: 3,
      entityTitle: "Vase #3",
      message: "mentioned you in a note.",
      isRead: true,
      createdAt: "2025-09-16T18:00:00Z",
    },
    {
      id: 3,
      notificationType: "system",
      entityType: "course",
      entityId: 4,
      entityTitle: "Advanced Wheel Throwing",
      message: "Your new course has been approved.",
      isRead: true,
      createdAt: "2025-09-15T12:00:00Z",
    },
  ];
};
const fetchEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      title: "Introduction to Hand-Building",
      thumbnailUrl: "https://placehold.co/400x300/e0f2fe/0891b2?text=Course+1",
      progress: 75,
    },
    {
      id: 2,
      title: "Glaze Chemistry 101",
      thumbnailUrl: "https://placehold.co/400x300/dbeafe/1e40af?text=Course+2",
      progress: 40,
    },
  ];
};
const fetchMyNotes = async (): Promise<Note[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      title: "Cobalt Blue observations",
      content:
        "The 'heaping and piling' is very pronounced here. Need to compare with Xuande period examples.",
      entityType: "artwork",
      entityId: 1,
      entityTitle: "Blue-and-white Plate",
      createdAt: "2025-09-10T11:00:00Z",
      updatedAt: "2025-09-12T15:45:00Z",
    },
    {
      id: 2,
      title: "Dragon Motif study",
      content: "The three-clawed dragon is typical for this period.",
      entityType: "artwork",
      entityId: 1,
      entityTitle: "Blue-and-white Plate",
      createdAt: "2025-09-01T18:20:00Z",
      updatedAt: "2025-09-01T18:20:00Z",
    },
  ];
};
const fetchMyWorks = async (): Promise<PortfolioWork[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      title: "Spiral Vase",
      thumbnailUrl: "https://placehold.co/400x400/fff7ed/c2410c?text=Work+1",
      upvotesCount: 128,
    },
    {
      id: 2,
      title: "Tea Bowl Set",
      thumbnailUrl: "https://placehold.co/400x400/fef2f2/b91c1c?text=Work+2",
      upvotesCount: 95,
    },
  ];
};
const fetchMyPosts = async (): Promise<ForumPost[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 123,
      title: "Glazing Techniques for Beginners",
      categoryName: "How To",
      createdAt: "2025-08-20T14:00:00Z",
      commentCount: 12,
      likeCount: 45,
    },
    {
      id: 124,
      title: "Showcase: My latest wood-fired pieces",
      categoryName: "Showcase",
      createdAt: "2025-07-11T09:30:00Z",
      commentCount: 5,
      likeCount: 33,
    },
  ];
};
const fetchMyFavorites = async (): Promise<Artwork[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 1,
      title: "Blue-and-white Plate",
      thumbnailUrl: "https://placehold.co/400x600/e0f2fe/0891b2?text=Fav+1",
      artistName: "Unknown",
      period: "Ming Yongle",
    },
    {
      id: 2,
      title: "Famille Rose Vase",
      thumbnailUrl: "https://placehold.co/400x600/fce7f3/831843?text=Fav+2",
      artistName: "Unknown",
      period: "Qing Yongzheng",
    },
  ];
};
const fetchMySaves = async (): Promise<ForumPost[]> => {
  return fetchMyPosts(); // For demo, assume saved posts are same as user's posts
};

// You would also have fetch functions for Works, Posts, Favorites, and Saves
// For brevity, their panels will show placeholder content.

// --- Route Definition ---

const accountSearchSchema = z.object({
  tab: z
    .enum([
      "notifications",
      "enrolled-courses",
      "my-notes",
      "my-works",
      "my-posts",
      "my-favorites",
      "my-saves",
    ])
    .default("notifications")
    .catch("notifications"),
});

export const Route = createFileRoute("/account/")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: AccountPage,
});

// --- Main Page Component ---

function AccountPage() {
  const search = Route.useSearch();
  const activeTab = () => search().tab;

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <AccountSidebar activeTab={activeTab()} />
        <main class="flex-grow">
          <Suspense
            fallback={
              <div class="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
            }
          >
            <Show when={activeTab() === "notifications"}>
              <NotificationsPanel />
            </Show>
            <Show when={activeTab() === "enrolled-courses"}>
              <EnrolledCoursesPanel />
            </Show>
            <Show when={activeTab() === "my-notes"}>
              <MyNotesPanel />
            </Show>
            <Show when={activeTab() === "my-works"}>
              <MyWorksPanel />
            </Show>
            <Show when={activeTab() === "my-posts"}>
              <MyPostsPanel />
            </Show>
            <Show when={activeTab() === "my-favorites"}>
              <MyFavoritesPanel />
            </Show>
            <Show when={activeTab() === "my-saves"}>
              <MySavesPanel />
            </Show>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// --- Panel Components ---

const PanelHeader: Component<{ title: string; children?: any }> = (props) => (
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">{props.title}</h2>
    <div>{props.children}</div>
  </div>
);

const NotificationsPanel: Component = () => {
  const query = useQuery(() => ({
    queryKey: ["profile-notifications"],
    queryFn: fetchNotifications,
  }));

  return (
    <div>
      <PanelHeader title="Notifications" />
      <div class="border rounded-lg bg-white overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 font-medium">Content</th>
              <th class="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            <For each={query.data}>
              {(notification) => (
                <tr class="border-b hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <Link
                      to={notification.link}
                      class="text-blue-600 hover:underline"
                    >
                      {notification.content}
                    </Link>
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EnrolledCoursesPanel: Component = () => {
  const query = useQuery(() => ({
    queryKey: ["profile-courses"],
    queryFn: fetchEnrolledCourses,
  }));

  return (
    <div>
      <PanelHeader title="Enrolled Courses" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={query.data}>
          {(course) => (
            <div class="border rounded-lg bg-white overflow-hidden shadow-sm">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                class="w-full h-40 object-cover"
              />
              <div class="p-4">
                <h3 class="font-semibold truncate">{course.title}</h3>
                <div class="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {course.progress}% complete
                </p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const MyNotesPanel: Component = () => {
  const query = useQuery(() => ({
    queryKey: ["profile-notes"],
    queryFn: fetchMyNotes,
  }));
  const [searchTerm, setSearchTerm] = createSignal("");

  const filteredNotes = () => {
    const lowerSearch = searchTerm().toLowerCase();
    if (!lowerSearch) return query.data;
    return query.data?.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerSearch) ||
        note.artworkTitle.toLowerCase().includes(lowerSearch) ||
        note.excerpt.toLowerCase().includes(lowerSearch),
    );
  };

  return (
    <div>
      <PanelHeader title="My Notes">
        <div class="relative w-64">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            class="form-input w-full pl-10"
          />
          <MagnifyingGlass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </PanelHeader>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={filteredNotes()}>
          {(note) => (
            <div class="border rounded-lg bg-white p-4 shadow-sm">
              <h3 class="font-semibold">{note.title}</h3>
              <p class="text-sm text-gray-600 mt-1 italic">
                on{" "}
                <Link
                  to={`/gallery/artworks/${note.artworkId}`}
                  class="text-blue-600 hover:underline"
                >
                  {note.artworkTitle}
                </Link>
              </p>
              <p class="text-sm text-gray-500 mt-2 line-clamp-2">
                {note.excerpt}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
