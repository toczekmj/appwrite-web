'use client'

import useAuthContext, {AuthContextType} from "@/CodeBehind/Components/Auth/useAuthContext";
import React, {createContext, useContext} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const provider = useAuthContext();

    return (
        <AuthContext.Provider value={provider}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}