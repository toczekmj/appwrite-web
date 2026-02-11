import {Card, TextField, Text} from "@radix-ui/themes";
import {LucideMail} from "lucide-react";
import React from "react";

interface PropertyUpdateCardProps {
    headline: string;
    placeholder: string;
    value?: string;
    onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isConfidential?: boolean;
}

export default function PropertyUpdateCard(props: PropertyUpdateCardProps) {
    return (
        <Card>
            <div className="flex flex-col gap-8 min-h-fit h-full">
                <Text size="5">{props.headline}:</Text>
                <TextField.Root size="3"
                                placeholder={props.placeholder}
                                onChange={props.onchange}
                                value={props.value ?? ""}
                                type={props.isConfidential ? "password" : "email"}>
                    <TextField.Slot>
                        <LucideMail/>
                    </TextField.Slot>
                </TextField.Root>
            </div>
        </Card>
    )
}