'use client'

import React from 'react';
import {Card, Text} from "@radix-ui/themes";
import Model from "@/components/Dashboard/Home/Models/Model";

function ModelsCard() {
    return (
        <Card>
            <div className={"flex-w-full grow text-center pt-3"}>
                <Text size={"6"}>Models</Text>
                <div className={"flex flex-col gap-2 mt-8"}>
                    <Model modelId={"asdfasdf"} onModelDelete={() => {}} modelName={"Test model"}/>
                    <Model modelId={"asdfasdf"} onModelDelete={() => {}} modelName={"Test model"}/>
                    <Model modelId={"asdfasdf"} onModelDelete={() => {}} modelName={"Test model"}/>
                </div>
            </div>
        </Card>
    );
}

export default ModelsCard;