'use client'

import {TabNav, Text} from "@radix-ui/themes";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Sidebar(){
    const pathname = usePathname();

    return (
      <div className="flex flex-row gap-5 m-3 py-3 px-8 rounded-4xl w-fit"
           style={{ backgroundColor: 'var(--gray-3)' }}>
          <TabNav.Root>
              <TabNav.Link asChild active={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                      <Text size={"5"}>Dashboard</Text>
                  </Link>
              </TabNav.Link>
              <TabNav.Link asChild active={pathname === "/dashboard/settings"}>
                  <Link href="/dashboard/settings">
                      <Text size={"5"}>Settings</Text>
                  </Link>
              </TabNav.Link>
          </TabNav.Root>
      </div>
    );
}