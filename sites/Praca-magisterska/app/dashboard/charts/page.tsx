'use client'


import {Button} from "@radix-ui/themes";
import {useAuth} from "@/components/Auth/AuthContext";
import {account} from "@/lib/appwrite";
import {ExecuteFft, ExecuteFftInBackground} from "@/lib/Functions/functions";

export default function Charts() {
    const {currentUserInfo} = useAuth();
    async function renderChart() {
        const jwt = await account.createJWT();
        const res = await ExecuteFftInBackground("698de39b001a010e9eba", currentUserInfo?.$id || "");
        console.log(res);
    }


    return (
        <>
            <Button onClick={renderChart}>Test</Button>
        </>)
}
