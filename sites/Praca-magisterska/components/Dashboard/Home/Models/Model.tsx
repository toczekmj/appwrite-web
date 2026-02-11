import React from 'react';
import {BrainIcon, XIcon} from "lucide-react";
import {Button, Text} from "@radix-ui/themes";

interface ModelProps {
    modelName: string;
    modelId: string;
    onModelDelete: (id: string) => void;
}

function Model({modelName, modelId, onModelDelete}: ModelProps) {
    return (
        <div className="flex grow flex-row border rounded-md p-2 gap-2 justify-between w-full items-center">
            <BrainIcon size={30}/>
            <Text size={"5"}>{modelName}</Text>
            <Button color={"red"}
                    size={"2"}
                    onClick={() => onModelDelete(modelId)}>
                <XIcon/>
            </Button>
        </div>
    );
}

export default Model;