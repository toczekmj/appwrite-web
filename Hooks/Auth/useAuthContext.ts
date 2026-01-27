'use client'
import {account} from "@/lib/appwrite";
import {AppwriteException, ID, Models, OAuthProvider} from "appwrite"
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export interface AuthContextType {
    current: Models.Session | null;
    loading: boolean;
    currentUserInfo: Models.User | null;
    login: (email: string, password: string) => Promise<void>;
    loginOAuth2Google: () => Promise<void>;
    loginOAuth2GitHub: () => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
    updateEmail: (newEmail: string, password: string) => Promise<void>;
    updateName: (newName: string) => Promise<void>;
    getUser: () => Promise<Models.User | null>;
}

export default function useAuthContext() {
    const router = useRouter();

    const [current, setCurrent] = useState<Models.Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserInfo, setCurrentUserInfo] = useState<Models.User | null>(null);

    const login = async (email: string, password: string): Promise<void> => {
        const session = await account.createEmailPasswordSession({ email, password });
        setCurrent(session);
        //setCurrentUserInfo(await getUser());
        router.push('/dashboard');
    }

    const loginOAuth2Google = async () => {
        account.createOAuth2Token({
            provider: OAuthProvider.Google,
            success: "http://localhost:3000/dashboard",
            failure: "http://localhost:3000/login",
        });
    }

    const loginOAuth2GitHub = async () => {
        account.createOAuth2Session({
            provider: OAuthProvider.Github,
            success: "http://localhost:3000/dashboard",
            failure: "http://localhost:3000/login",
        });
    }

    const logout = async (): Promise<void> => {
        try {
            await account.deleteSession("current");
            setCurrent(null);
            setCurrentUserInfo(null)
        }
        catch (error) {
            console.error(error);
        }
        finally {
            router.push('/login');
        }
    }

    const register = async (email: string, name: string, password: string): Promise<void> => {
        try {
            await account.create({
                userId: ID.unique(),
                email, password,
                name: name,
            });
            await login(email, password);
        }
        catch (error) {
            if (error instanceof AppwriteException) {
                if (error.code === 409) {
                    throw new Error("Email already in use.");
                }
            }

            throw new Error("Failed to register.");
        }
    }

    const updatePassword = async (newPassword: string, oldPassword: string): Promise<void> => {
        try {
            await account.updatePassword({
                password: newPassword,
                oldPassword: oldPassword,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    const updateEmail = async (newEmail: string, password: string): Promise<void> => {
        try {
            await account.updateEmail({
                email: newEmail,
                password: password,
            })
        }
        catch (error) {
            console.error(error);
        }
    };

    const updateName = async (newEmail: string): Promise<void> => {
        try {
            await account.updateName({
                name: newEmail,
            })
        }
        catch (error) {
            console.error(error);
        }
    };

    const getUser = async (): Promise<Models.User | null> => {
        return await account.get();
    }

    useEffect(() => {
        account
            .getSession("current")
            .then(setCurrent)
            .catch(() => setCurrent(null))
            .finally(() => setLoading(false));

        getUser()
            .then(setCurrentUserInfo)
            .catch((e) => {
                console.warn("ERROR IN getUser() in useAuthContext useEffect()");
                console.error(e);
                console.error(e.message);
                setCurrentUserInfo(null)
            })
            .finally(() => setLoading(false));

    }, []);

    return {
        current,
        currentUserInfo,
        loading,
        login,
        loginOAuth2Google,
        loginOAuth2GitHub,
        logout,
        register,
        updatePassword,
        updateEmail,
        updateName,
        getUser
    }
}