import {TabNav, Text} from "@radix-ui/themes";
import Link from "next/link";
import {Responsive} from "@radix-ui/themes/props";
import {Pages} from "@/Enums/Pages";

interface SubNavProps {
    isActive: (p: Pages) => boolean;
    parent: Pages;
    size?: Responsive<"4" | "1" | "2" | "3" | "5" | "6" | "7" | "8" | "9"> | undefined
}

export default function SubNav({isActive, size}: SubNavProps) {
    return (
        <TabNav.Root>
            <TabNav.Link asChild active={isActive(Pages.dashboard)}>
                <Link href={Pages.dashboard}>
                    <Text size={size ?? "1"}>Home</Text>
                </Link>
            </TabNav.Link>
            <TabNav.Link asChild active={isActive(Pages.files)}>
                <Link href={Pages.files}>
                    <Text size={size ?? "1"}>File management</Text>
                </Link>
            </TabNav.Link>
            <TabNav.Link asChild active={isActive(Pages.charts)}>
                <Link href={Pages.charts}>
                    <Text size={size ?? "1"}>Charts</Text>
                </Link>
            </TabNav.Link>
        </TabNav.Root>
    );
}