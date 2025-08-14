import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/gallery/$artworkId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/gallery/$artworkId"!</div>;
}
