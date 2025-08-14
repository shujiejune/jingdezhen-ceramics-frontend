import { createFileRoute } from "@tanstack/solid-router";
import { useQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";

const fetchArtworks = async () => {
  console.log("Fetching artworks from Go backend...");
  await new Promise((r) => setTimeout(r, 1500)); // Simulate network delay
  return [
    { id: 1, title: "Blue & White Dragon Vase" },
    { id: 2, title: "Famille Rose Peony Plate" },
  ];
};

export const Route = createFileRoute()({
  component: GalleryPage,
});

function GalleryPage() {
  const query = useQuery(() => ({
    queryKey: ["artworks"],
    queryFn: fetchArtworks,
  }));

  return (
    <div class="p-8">
      <h1 class="text-4xl font-bold mb-6">Gallery</h1>

      {/* THIS IS THE KEY TO STREAMING */}
      <Suspense
        fallback={<p class="text-lg text-gray-500">Loading artworks...</p>}
      >
        <div class="grid grid-cols-3 gap-6">
          <For each={query.data}>
            {(artwork) => (
              <div class="bg-white rounded-lg shadow p-4">
                <h2 class="text-xl font-semibold">{artwork.title}</h2>
              </div>
            )}
          </For>
        </div>
      </Suspense>
    </div>
  );
}
