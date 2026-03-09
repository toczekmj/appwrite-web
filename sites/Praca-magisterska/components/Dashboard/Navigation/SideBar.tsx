'use client'

import {usePathname} from "next/navigation";
import TopNav from "@/components/Dashboard/Navigation/TopNav";
import SubNav from "@/components/Dashboard/Navigation/SubNav";
import {Pages, getMainNavItems} from "@/Enums/Pages";
import {useAuth} from "@/components/Auth/AuthContext";


/**
 * 
 * @returns Sidebar component
 * Sidebar component is used to display the sidebar of the application.
 * Is is dynamically generated based on {@link NAV_ITEMS}
 */
export default function Sidebar() {
    const pathname = usePathname();
    const {currentUserInfo} = useAuth();
    const mainItems = getMainNavItems();
    
    const isParentActive = (parent: Pages) => {
        return pathname.includes(parent);
    }

    const isActive = (p: Pages): boolean => {
        return p === pathname;
    }

    return currentUserInfo ? (
        <div className="flex flex-col gap-5 my-3 py-3 px-8 rounded-4xl w-fit"
             style={{backgroundColor: 'var(--gray-3)'}}>
            <TopNav isActive={isParentActive} size={"5"}/>
            {
                mainItems.some(item => pathname.includes(item.page)) ? (
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