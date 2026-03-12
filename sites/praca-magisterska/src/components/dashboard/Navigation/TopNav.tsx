import {TabNav, Text} from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import type { Responsive } from "@radix-ui/themes/props";
import {getMainNavItems, Pages} from "#/enums/Pages";
import type { LastSubRouteByParent } from "#/lib/localStorage/localStorageNavBarHelper";

interface TopNavProps {
    isActive: (p: Pages) => boolean;
    size?: Responsive<"4" | "1" | "2" | "3" | "5" | "6" | "7" | "8" | "9"> | undefined
    hrefOverrides?: LastSubRouteByParent;
}

/**
 * TopNav component is used to display the top navigation of the application.
 * It is dynamically generated based on {@link getMainNavItems}
 */
export default function TopNav({isActive, size}: TopNavProps) {
    const mainItems = getMainNavItems();
    return (
        <TabNav.Root>
            {
                mainItems.map((item) => {
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