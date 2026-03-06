'use client'

import {Card, Text} from "@radix-ui/themes";
import Model from "@/components/Dashboard/Home/Models/Model";
import { Models } from "@/Generated/appwrite/types";

function ModelsCard({models}: {models: Models[] | null}) {
    return (
        <Card>
            <div className={"flex-w-full grow text-center pt-3"}>
                <Text size={"6"}>Models</Text>
                <div className={"flex flex-col gap-2 mt-8"}>
                    {
                        models?.map((model) => (
                            <Model key={model.$id} modelId={model.$id} onModelDelete={() => {}} modelName={model.name}/>
                        ))
                    }
                </div>
            </div>
        </Card>
    );
}

export default ModelsCard;