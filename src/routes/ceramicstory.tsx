import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/ceramicstory")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/ceramicstory"!</div>;
}
