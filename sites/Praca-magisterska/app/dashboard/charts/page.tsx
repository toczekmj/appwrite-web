'use client'


import {Button} from "@radix-ui/themes";
import {useAuth} from "@/components/Auth/AuthContext";
import {account} from "@/lib/appwrite";
import {ExecuteFft} from "@/lib/Functions/functions";

export default function Charts() {

    const {current} = useAuth();

    async function renderChart() {
        const token = current?.providerAccessToken;
        const userId = current?.userId;
        const id = current?.$id;

        console.log("Token:" + token);
        console.log("User id:" + userId);
        console.log("Id:" + id);


        const session = await account.listSessions();
        console.log(session);

        const jwt = await account.createJWT();
        console.log(jwt);
        const res = await ExecuteFft("whatever", id)
        console.log(res.responseBody);


    }


    return (
        <>
            <Button onClick={renderChart}>Render Chart</Button>
        </>)
}
