import { useAuth } from "#/components/auth/AuthContext";
import { Button, Flex, Section, Text } from "@radix-ui/themes";
import { useRouter } from '@tanstack/react-router';

export function Navbar() {
	const { current, logout } = useAuth();
	const router = useRouter();

	return (
		<Section p="4" style={{ backgroundColor: "var(--gray-2)" }}>
			<Flex direction="row" justify="between">
				<Text size='8'>ShazaML</Text>

				{
					current ? (
						<Button size="4"
							variant="solid"
							onClick={logout}>
							Logout
						</Button>
					) : (
						<Button size="4"
							variant="solid"
							onClick={() => router.navigate({ to: '/login' })}>
							Login
						</Button>
					)
				}
			</Flex>
		</Section>
	)
}
