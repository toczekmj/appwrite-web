'use client'
import { useAuth } from "@/components/Auth/AuthContext";
import ModelsCard from "@/components/Dashboard/Home/Models/ModelsCard";
import { Models } from "@/Generated/appwrite/types";
import { GetModels } from "@/lib/Database/Services/ModelService";
import { CreateModelSynchronously } from "@/lib/Functions/functions";
import { Button, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function Dashboard() {

    const [models, setModels] = useState<Models[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { currentUserInfo } = useAuth();

    async function getModels() {
        setLoading(true);
        try {
            const models = await GetModels();
            console.log("models:", models);
            setModels(models);
        } catch (error) {
            console.error(error);
            setModels(null);
        } finally {
            setLoading(false);
        }
    }

    async function createModel() {
        if (!currentUserInfo?.$id) {
            console.error("User ID is required");
            return;
        }
        try {
            await CreateModelSynchronously(currentUserInfo?.$id);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Button onClick={getModels}>Retrieve Models</Button>
            <Button onClick={createModel}>Create Model</Button>
            {loading && <Text size={"5"}>Loading...</Text>}
            {
                models ? <ModelsCard models={models}/> : <Text size={"5"}>No models found</Text>
            }
        </div>
    );
}