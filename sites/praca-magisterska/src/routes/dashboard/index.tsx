import ModelsCard from '#/components/dashboard/Home/Models/ModelsCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <ModelsCard />
}
