import { Link } from "@tanstack/solid-router";
import { For, type Component } from "solid-js";
import {
  Bell,
  BookOpen,
  Notebook,
  Palette,
  Swap,
  Heart,
  BookmarkSimple,
} from "~/components/icons/Phosphor";

export const AccountSidebar: Component<{ activeTab: string }> = (props) => {
  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "enrolled-courses", label: "Enrolled Courses", icon: BookOpen },
    { id: "my-notes", label: "My Notes", icon: Notebook },
    { id: "my-works", label: "My Works", icon: Palette },
    { id: "my-posts", label: "My Posts", icon: Swap },
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
                    to="/account"
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
