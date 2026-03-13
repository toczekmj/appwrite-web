import TopNav from "#/components/dashboard/Navigation/TopNav";
import SubNav from "#/components/dashboard/Navigation/SubNav";
import {Pages, getMainNavItems, getSubNavItems } from "#/enums/Pages";
import {useAuth} from "#/components/auth/AuthContext";
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

    const isParentActive = (parent: Pages) => {
        return pathname.includes(parent);
    }

    const isActive = (p: Pages): boolean => {
        return p === pathname;
    }

    const shouldShowSubNav = mainItems.some((item) =>
        getSubNavItems(item.page).some((subItem) => pathname.includes(subItem.page))
    );

    return currentUserInfo ? (
        <div className="flex flex-col gap-5 my-3 py-3 px-8 rounded-4xl w-fit"
             style={{backgroundColor: 'var(--gray-3)'}}>
            <TopNav isActive={isParentActive} size={"5"}/>
            {shouldShowSubNav && (
                <div className="flex flex-col items-start">
                    {mainItems.map((item) => (
                        <SubNav key={item.page} isActive={isActive} size={"4"} parent={item.page}/>
                    ))}
                </div>
            )}
        </div>
    ) : null
}