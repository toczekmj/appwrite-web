'use client'

import {Form} from "@radix-ui/react-form";
import {Button, TextField} from "@radix-ui/themes";
import {Mail, ScanEyeIcon} from "lucide-react";
import React from "react";

interface AuthFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    submitType: string;
    isSignup: boolean;
}

export default function AuthForm({handleSubmit, submitType, isSignup}: AuthFormProps) {
    return (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextField.Root placeholder="E-mail" type="email" name="email" size="3">
                    <TextField.Slot>
                        <Mail/>
                    </TextField.Slot>
                </TextField.Root>

                {
                    isSignup ? (
                        <TextField.Root placeholder="Name" type="text" name="name" size="3">
                            <TextField.Slot>
                                <Mail/>
                            </TextField.Slot>
                        </TextField.Root>
                    ) : (<></>)
                }

                <TextField.Root placeholder="Password" type="password" name="password" size="3">
                    <TextField.Slot>
                        <ScanEyeIcon/>
                    </TextField.Slot>
                </TextField.Root>
                <Button size="4">{submitType}</Button>
            </Form>
    );
}