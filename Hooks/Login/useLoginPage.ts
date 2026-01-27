'use client'

import {useAuth} from '@/components/Auth/AuthContext'
import React, {useState} from "react";

export default function useLoginPage() {
    const { login, register, loginOAuth2Google, loginOAuth2GitHub} = useAuth();
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
            console.error(error);
            // TODO: display toaster when error
        }
        finally {
            form.reset();
        }
    }

    const handleLoginWithGoogle = async () => {
        try {
            await loginOAuth2Google();
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleLoginWithGitHub = async () => {
        try {
            await loginOAuth2GitHub();
        }
        catch (error) {
            console.error(error);
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
        handleLoginWithGoogle,
        handleLoginWithGitHub,
        handleRegistration,
    }
}