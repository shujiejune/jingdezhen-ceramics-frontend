import { createFileRoute } from "@tanstack/solid-router";
/*
export const Route = createFileRoute()({
  // The UI component for this route.
  // Type: A SolidJS component function.
  component: PostComponent,

  // Fetches data before the component renders.
  // Type: An async function that returns the data.
  loader: async ({ params }) => {
    // 'params' is provided by the router and contains { postId: '...' }
    return fetchPostById(params.postId);
  },

  // Validates search params like ?showComments=true
  // Type: A function that takes search params and returns a validated object.
  validateSearch: (search) => {
    return z.object({ showComments: z.boolean().optional() }).parse(search);
  },

  // A component to show if the loader fails.
  // Type: A SolidJS component function.
  errorComponent: PostErrorComponent,
  }); */
