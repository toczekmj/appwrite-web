'use client'
import React, {useEffect} from "react";
import {useAuth} from "@/components/Auth/AuthContext";
import {useRouter} from "next/navigation";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const {currentUserInfo} = useAuth();
    const router = useRouter();
    useEffect(() => {
        console.log(currentUserInfo);
        if (!currentUserInfo) {
            router.push('/login');
        }
    }, [currentUserInfo, router]);

    return (
        <div>
            {children}
        </div>
    )
}