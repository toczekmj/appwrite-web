'use client'

import {useAuth} from "@/components/Auth/AuthContext";
import {Models} from "appwrite";
import React, {useEffect, useState} from "react";

export function useDashboardSettings() {
    const auth = useAuth();

    const [user, setUser] = useState<Models.User | null>();
    const [name, setName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [newPassword, setNewPassword] = useState<string | undefined>(undefined);

    useEffect(() => {
        auth.getUser().then(u => setUser(u));
    }, [auth])

    function onSaveSuccess() {
        setEmail(undefined);
        setName(undefined);
        setNewPassword(undefined);
        auth.getUser().then(u => setUser(u));
    }

    function updateEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.currentTarget.value);
    }

    function updateName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.currentTarget.value);
    }

    function updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setNewPassword(event.currentTarget.value);
    }

    return {
        user,
        name,
        email,
        newPassword,
        onSaveSuccess,
        updateEmail,
        updateName,
        updatePassword,
    };
}