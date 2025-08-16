import { createSignal, For, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import {
  List,
  MagnifyingGlass,
  SignIn,
  Translate,
  CaretLeft,
  Trophy,
  Books,
  Swap,
  HandsClapping,
  EnvelopeOpen,
  X,
} from "phosphor-solid";
import type { Component } from "solid-js";
import { CeramicstoryIcon } from "~/components/icons/CeramicstoryIcon";
import { EngageIcon } from "~/components/icons/EngageIcon";

// --- Main Component: Manages State ---
export const VerticalNavbar: Component = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);

  // --- MOCK DATA: Replace with real user state ---
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [language, setLanguage] = createSignal<"en" | "cn">("en");

  const toggleLanguage = () => {
    setLanguage((lang) => (lang === "en" ? "cn" : "en"));
  };

  // A simple function to simulate login/logout for the demo
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn());

  return (
    <>
      <nav class="relative z-20 flex flex-col items-center w-24 h-full bg-white shadow-lg">
        <CollapsedNav
          onMenuClick={() => setIsMenuOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          isLoggedIn={isLoggedIn()}
          onAvatarClick={toggleLogin} // In real app, this would go to profile or logout
          language={language()}
          onTranslateClick={toggleLanguage}
        />
      </nav>

      <ExpandedMenu
        isOpen={isMenuOpen()}
        onClose={() => setIsMenuOpen(false)}
      />

      <SearchBar
        isOpen={isSearchOpen()}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

// --- Sub-Component: Collapsed Navbar View ---
interface CollapsedNavProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  isLoggedIn: boolean;
  onAvatarClick: () => void;
  language: "en" | "cn";
  onTranslateClick: () => void;
}

const CollapsedNav: Component<CollapsedNavProps> = (props) => {
  return (
    <div class="flex flex-col items-center justify-between h-full w-full py-6">
      <div class="flex flex-col items-center space-y-8">
        <NavButton icon={List} text="Menu" onClick={props.onMenuClick} />
        <NavButton
          icon={MagnifyingGlass}
          text="Search"
          onClick={props.onSearchClick}
        />
      </div>
      <div class="flex flex-col items-center space-y-8">
        <Show
          when={props.isLoggedIn}
          fallback={
            <Link href="/login">
              <NavButton icon={SignIn} text="Join" />
            </Link>
          }
        >
          <button
            onClick={props.onAvatarClick}
            class="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <img
              src="https://placehold.co/40x40/E2E8F0/4A5568?text=A"
              alt="User Avatar"
              class="w-10 h-10 rounded-full"
            />
          </button>
        </Show>
        <NavButton
          icon={Translate}
          text={props.language === "en" ? "English(US)" : "简体中文"}
          onClick={props.onTranslateClick}
        />
      </div>
    </div>
  );
};

// --- Sub-Component: Expanded Menu View ---
interface ExpandedMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpandedMenu: Component<ExpandedMenuProps> = (props) => {
  const menuItems = [
    { href: "/ceramicstory", icon: CeramicstoryIcon, text: "Ceramic Story" },
    { href: "/gallery", icon: Trophy, text: "Gallery" },
    { href: "/engage", icon: EngageIcon, text: "Engage" },
    { href: "/course", icon: Books, text: "Course" },
    { href: "/forum", icon: Swap, text: "Forum" },
    { href: "/portfolio", icon: HandsClapping, text: "Portfolio" },
    { href: "/contact", icon: EnvelopeOpen, text: "Contact" },
  ];

  return (
    <div
      class="fixed top-0 left-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out z-30"
      classList={{
        "translate-x-0 w-72": props.isOpen,
        "-translate-x-full w-72": !props.isOpen,
      }}
    >
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Menu</h2>
        <button
          onClick={props.onClose}
          class="text-gray-500 hover:text-gray-800"
        >
          <CaretLeft size={24} />
        </button>
      </div>
      <ul class="p-4">
        <For each={menuItems}>
          {(item) => (
            <li>
              <Link
                href={item.href}
                class="flex items-center space-x-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors [&.active]:font-bold [&.active]:bg-blue-50 [&.active]:text-blue-600"
                onClick={props.onClose}
              >
                <item.icon size={24} />
                <span>{item.text}</span>
              </Link>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

// --- Sub-Component: Pop-out Search Bar ---
interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}
const SearchBar: Component<SearchBarProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-20"
        onClick={props.onClose}
      >
        <div
          class="relative w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlass size={20} />
          </div>
          <input
            type="text"
            placeholder="Search across the website..."
            class="w-full h-12 pl-12 pr-24 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button class="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-600 hover:text-blue-600">
            Search
          </button>
          <button
            onClick={props.onClose}
            class="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <X size={28} />
          </button>
        </div>
      </div>
    </Show>
  );
};

// --- Helper Component: A single button for the collapsed nav ---
interface NavButtonProps {
  icon: Component<{ size: number }>;
  text: string;
  onClick?: () => void;
}
const NavButton: Component<NavButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      class="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors"
    >
      <props.icon size={28} />
      <span class="text-xs font-medium">{props.text}</span>
    </button>
  );
};
