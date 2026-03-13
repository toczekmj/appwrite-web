import React, { useEffect } from 'react'
import {useAuth} from "#/components/auth/AuthContext";
import {useRouter} from "@tanstack/react-router";

export default function Protected({children}: { children: React.ReactNode }) {
    const {currentUserInfo} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!currentUserInfo) {
            router.navigate({to: '/login'});
        }
    }, [currentUserInfo, router]);

    return (
        <div>
            {children}
        </div>
    );
}