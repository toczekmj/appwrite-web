import { TabNav, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import type { Responsive } from "@radix-ui/themes/props";
import type { Pages } from "#/enums/Pages";
import { getSubNavItems } from "#/enums/Pages";

interface SubNavProps {
	isActive: (p: Pages) => boolean;
	parent: Pages;
	size?: Responsive<"4" | "1" | "2" | "3" | "5" | "6" | "7" | "8" | "9"> | undefined
}

/**
 * SubNav component is used to display the sub navigation of the application.
 * It is dynamically generated based on {@link getSubNavItems}
 */
export default function SubNav({ isActive, parent, size }: SubNavProps) {
	const subItems = getSubNavItems(parent);
	return (
		<TabNav.Root>
			{
				subItems.map((item) => {
					return (
						<TabNav.Link key={item.page} asChild active={isActive(item.page)}>
							<Link to={item.page as any}>
								<Text size={size ?? "1"}>{item.label}</Text>
							</Link>
						</TabNav.Link>
					)
				})
			}
		</TabNav.Root>
	);
}
