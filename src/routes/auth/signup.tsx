import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/signup"!</div>;
}
