import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/charts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <p>Charts</p>
}
