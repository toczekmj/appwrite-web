import { requireAuth } from '#/lib/auth/routeAuth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: () => requireAuth(),
	component: App,
})

function App() {
	return (
		<main>
			<h1>ShazaML</h1>
		</main>
	)
}
