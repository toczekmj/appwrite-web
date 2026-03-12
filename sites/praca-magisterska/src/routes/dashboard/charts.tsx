import Protected from '#/components/auth/Protected'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/charts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Protected>
      <p>Charts</p>
    </Protected>
  )
}
