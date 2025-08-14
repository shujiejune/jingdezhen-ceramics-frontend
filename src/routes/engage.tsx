import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/engage")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/engage"!</div>;
}
