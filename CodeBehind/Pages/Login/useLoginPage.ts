'use client'

import {useAuth} from '@/components/Auth/AuthContext'
import React, {useEffect, useState} from "react";
import {Pages} from "@/Enums/Pages";
import {useRouter} from "next/navigation";

export default function useLoginPage() {
    const router = useRouter();
    const {current} = useAuth();
    useEffect(() => {
        if (current) {
            router.push(Pages.dashboard);
        }
    }, [current, router]);

    const { login, register } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            await login(
                formData.get('email') as string,
                formData.get('password') as string
            );
        }
        catch (error) {
            console.warn("ERROR IN useLoginPage");
            console.error(error);
            // TODO: display toaster when error
        }
        finally {
            form.reset();
        }
    }

    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        try {
            await register(
                formData.get('email') as string,
                formData.get('name') as string,
                formData.get('password') as string
            );
        }
        catch (error) {
            // TODO: display toaster when error
        }
        finally {
            form.reset();
        }
    }

    return {
        isSignUp,
        setIsSignUp,
        handleLogin,
        handleRegistration,
    }
}