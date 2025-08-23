import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/forum/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/forum/new"!</div>
}
