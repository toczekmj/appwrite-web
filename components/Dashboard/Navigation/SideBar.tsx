'use client'

import {usePathname} from "next/navigation";
import MainNav from "@/components/Dashboard/Navigation/MainNav";
import SubNav from "@/components/Dashboard/Navigation/SubNav";
import {Pages} from "@/app/Enums/Pages";

export default function Sidebar() {
    const pathname = usePathname();

    const isParentActive = (parent: Pages) => {
        return pathname.includes(parent);
    }

    const isActive = (p: Pages): boolean => {
        return p === pathname;
    }

    return (
        <div className="flex flex-col gap-5 my-3 py-3 px-8 rounded-4xl w-fit"
             style={{backgroundColor: 'var(--gray-3)'}}>
            <MainNav isActive={isParentActive} size={"5"} />
            {
                pathname.includes(Pages.dashboard) ? (
                    <div className="flex flex-col items-start">
                        <SubNav isActive={isActive} size={"4"} parent={Pages.dashboard} />
                    </div>
                ) : <></>
            }

        </div>
    );
}