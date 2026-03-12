import TopNav from "#/components/dashboard/Navigation/TopNav";
import SubNav from "#/components/dashboard/Navigation/SubNav";
import {Pages, getMainNavItems, getSubNavItems} from "#/enums/Pages";
import {useAuth} from "#/components/auth/AuthContext";
import {NAV_ITEMS} from "#/enums/Pages";
import type { LastSubRouteByParent } from "#/lib/localStorage/localStorageNavBarHelper";
import { getStoredLastSubRoutes, setStoredLastSubRoutes } from "#/lib/localStorage/localStorageNavBarHelper";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

/**
 * @returns Sidebar component
 * Sidebar component is used to display the sidebar of the application.
 * Is is dynamically generated based on {@link NAV_ITEMS}
 */
export default function Sidebar() {
    const pathname = useLocation().pathname;
    const {currentUserInfo} = useAuth();
    const mainItems = getMainNavItems();
    const [lastSubRouteByParent, setLastSubRouteByParent] = useState<LastSubRouteByParent>(() => getStoredLastSubRoutes());

    useEffect(() => {
        const currentSection = mainItems.find(item => pathname.includes(item.page));
        if (!currentSection) return;

        setStoredLastSubRoutes({...lastSubRouteByParent, [currentSection.page]: pathname})
        setLastSubRouteByParent({[currentSection.page]: pathname})
    }, [pathname])

    const isParentActive = (parent: Pages) => {
        return pathname.includes(parent);
    }

    const isActive = (p: Pages): boolean => {
        return p === pathname;
    }

    return currentUserInfo ? (
        <div className="flex flex-col gap-5 my-3 py-3 px-8 rounded-4xl w-fit"
             style={{backgroundColor: 'var(--gray-3)'}}>
            <TopNav isActive={isParentActive} size={"5"} hrefOverrides={lastSubRouteByParent}/>
            {
                getSubNavItems(mainItems.find(item => item.page === pathname)?.page as Pages).length > 0 ? (
                    <div className="flex flex-col items-start">
                        {
                            mainItems.map((item) => {
                                return (
                                    <SubNav key={item.page} isActive={isActive} size={"4"} parent={item.page}/>
                                )
                            })
                        }
                    </div>
                ) : <></>
            }

        </div>
    ) : <></>
}