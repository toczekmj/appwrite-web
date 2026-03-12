import Protected from '#/components/auth/Protected'
import { requireAuth } from '#/lib/auth/routeAuth'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuth(),
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <Protected>
      <Outlet />
    </Protected>
  )
}
