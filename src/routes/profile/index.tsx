import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show, Suspense, createSignal, type Component } from "solid-js";
import { z } from "zod";
import {
  Bell,
  BookOpen,
  Note,
  ImageSquare,
  ChatCircleText,
  Heart,
  BookmarkSimple,
  MagnifyingGlass,
} from "~/components/icons/Phosphor";

// --- Mock User Data ---
const mockUser = {
  nickname: "CeramicMaster",
  avatarUrl: "https://placehold.co/100x100/d1fae5/065f46?text=CM",
};

// --- Mock Data & API Fetching ---
// In a real app, these types would likely live in `src/lib/types.ts`

interface Notification {
  id: number;
  type: "comment" | "mention" | "system";
  content: string;
  link: string;
  createdAt: string;
}
const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: 1,
      type: "comment",
      content: "User 'ClayFan' replied to your post in 'Glazing Techniques'.",
      link: "/forum/123",
      createdAt: "2025-09-17T10:30:00Z",
    },
    {
      id: 2,
      type: "mention",
      content: "You were mentioned in a comment on 'Vase #3'.",
      link: "/portfolio/works/3",
      createdAt: "2025-09-16T18:00:00Z",
    },
    {
      id: 3,
      type: "system",
      content: "Your new course 'Advanced Wheel Throwing' has been approved.",
      link: "/course/4",
      createdAt: "2025-09-15T12:00:00Z",
    },
  ];
};

interface EnrolledCourse {
  id: number;
  title: string;
  thumbnailUrl: string;
  progress: number; // Percentage
}
const fetchEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  await new Promise((r) => setTimeout(r, 400));
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

interface UserNote {
  id: number;
  title: string;
  excerpt: string;
  artworkId: number;
  artworkTitle: string;
}
const fetchMyNotes = async (): Promise<UserNote[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: 1,
      title: "Cobalt Blue observations",
      excerpt: "The 'heaping and piling' is very pronounced here...",
      artworkId: 1,
      artworkTitle: "Blue-and-white Plate",
    },
    {
      id: 2,
      title: "Dragon Motif study",
      excerpt: "The three-clawed dragon is typical for this period...",
      artworkId: 1,
      artworkTitle: "Blue-and-white Plate",
    },
  ];
};

// You would also have fetch functions for Works, Posts, Favorites, and Saves
// For brevity, their panels will show placeholder content.

// --- Route Definition ---

const profileSearchSchema = z.object({
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

export const Route = createFileRoute("/profile/")({
  validateSearch: (search) => profileSearchSchema.parse(search),
  component: ProfilePage,
});

// --- Main Page Component ---

function ProfilePage() {
  const search = Route.useSearch();
  const activeTab = () => search().tab;

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <ProfileSidebar activeTab={activeTab()} />
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
            {/* Add <Show> blocks for other panels here */}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// --- Sidebar Component ---
// In a real app, this would be in `src/components/layout/ProfileSidebar.tsx`
const ProfileSidebar: Component<{ activeTab: string }> = (props) => {
  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "enrolled-courses", label: "Enrolled Courses", icon: BookOpen },
    { id: "my-notes", label: "My Notes", icon: Note },
    { id: "my-works", label: "My Works", icon: ImageSquare },
    { id: "my-posts", label: "My Posts", icon: ChatCircleText },
    { id: "my-favorites", label: "My Favorites", icon: Heart },
    { id: "my-saves", label: "My Saves", icon: BookmarkSimple },
  ];

  return (
    <aside class="md:w-64 flex-shrink-0">
      <div class="flex flex-col items-center p-4 border rounded-lg bg-white">
        <img
          src={mockUser.avatarUrl}
          alt="User Avatar"
          class="w-24 h-24 rounded-full"
        />
        <h2 class="mt-3 text-xl font-semibold">{mockUser.nickname}</h2>
      </div>
      <nav class="mt-6">
        <ul class="space-y-1">
          <For each={tabs}>
            {(tab) => {
              const Icon = tab.icon;
              const isActive = () => props.activeTab === tab.id;
              return (
                <li>
                  <Link
                    to="/profile"
                    search={{ tab: tab.id }}
                    class="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 transition-colors"
                    classList={{
                      "bg-blue-100 text-blue-700 font-semibold": isActive(),
                      "hover:bg-gray-100": !isActive(),
                    }}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            }}
          </For>
        </ul>
      </nav>
    </aside>
  );
};

// --- Panel Components ---

const PanelHeader: Component<{ title: string; children?: any }> = (props) => (
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">{props.title}</h2>
    <div>{props.children}</div>
  </div>
);

const NotificationsPanel: Component = () => {
  const query = createQuery(() => ({
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
  const query = createQuery(() => ({
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
  const query = createQuery(() => ({
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
