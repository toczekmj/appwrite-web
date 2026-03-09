import {TabNav, Text} from "@radix-ui/themes";
import Link from "next/link";
import {Responsive} from "@radix-ui/themes/props";
import {getMainNavItems, Pages} from "@/Enums/Pages";

interface TopNavProps {
    isActive: (p: Pages) => boolean;
    size?: Responsive<"4" | "1" | "2" | "3" | "5" | "6" | "7" | "8" | "9"> | undefined
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
                            <Link href={item.page}>
                                <Text size={size ?? "1"}>{item.label}</Text>
                            </Link>
                        </TabNav.Link>
                    )
                })
            }
        </TabNav.Root>
    );
}