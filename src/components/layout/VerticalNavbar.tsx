import { Link } from "@tanstack/solid-router";

export function VerticalNavbar() {
  return (
    <nav class="w-24 bg-white shadow-md flex flex-col items-center p-4 space-y-6">
      <div class="text-xl font-bold text-gray-700">景</div>
      <div class="flex flex-col space-y-4">
        <Link
          to="/"
          class="text-gray-600 hover:text-blue-600 [&.active]:text-blue-600"
        >
          Home
        </Link>
        <Link
          to="/ceramicstory"
          class="text-gray-600 hover:text-blue-600 [&.active]:text-blue-600"
        >
          Story
        </Link>
        <Link
          to="/gallery"
          class="text-gray-600 hover:text-blue-600 [&.active]:text-blue-600"
        >
          Gallery
        </Link>
        <Link
          to="/engage"
          class="text-gray-600 hover:text-blue-600 [&.active]:text-blue-600"
        >
          Engage
        </Link>
        {/* ... other links */}
      </div>
    </nav>
  );
}
