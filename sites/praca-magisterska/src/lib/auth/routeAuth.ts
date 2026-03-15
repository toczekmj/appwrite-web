import { redirect } from '@tanstack/react-router'
import { account } from '#/lib/appwrite'

/**
 * Run in route beforeLoad. On the client, ensures user has a session and throws redirect to /login if not.
 * On the server (SSR), does nothing so we don't assume browser APIs; client-side Protected or hydration handles redirect.
 */
export async function requireAuth(): Promise<void> {
	if (typeof window === 'undefined') return
	try {
		await account.getSession({ sessionId: 'current' })
	} catch {
		throw redirect({ to: '/login' })
	}
}
