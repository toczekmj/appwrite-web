import {useAuth} from "@/components/Auth/AuthContext";
import {AlertDialog, Button, Inset, Table, Text, TextField} from "@radix-ui/themes";
import {Models} from "appwrite";
import React from "react";

interface SaveChangesDialogProps {
    currentUserInfo?: Models.User | null;
    email?: string;
    name?: string;
    password?: string;
    onSaveSuccess?: () => void;
}

export default function SaveChangesDialog(props: SaveChangesDialogProps) {
    const [password, setPassword] = React.useState<string | null>(null);
    const auth = useAuth();

    function updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.currentTarget.value);
    }

    async function handleUpdateUser() {
        if (!password) {
            console.error("You must provide a password in order to authorize the operation.");
            return;
        }

        if (props.password) {
            await auth.updatePassword(props.password, password);
        }

        if (props.email) {
            await auth.updateEmail(props.email, password);
        }

        if (props.name) {
            await auth.updateName(props.name);
        }

        props.onSaveSuccess?.();
    }

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button size={"4"}>Save</Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content maxWidth={"500px"}>
                <AlertDialog.Title>Review and authorize changes</AlertDialog.Title>
                <AlertDialog.Description size={"2"}>
                    Please review the changes below.
                    The changes needs to be authorized with your current password.
                </AlertDialog.Description>

                <Inset side={"x"} my={"5"}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Property</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Old value</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>New value</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                props.email != null ? (
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>E-mail</Table.ColumnHeaderCell>
                                        <Table.Cell>{props.currentUserInfo?.email}</Table.Cell>
                                        <Table.Cell>{props.email}</Table.Cell>
                                    </Table.Row>
                                ) : (<></>)
                            }
                            {
                                props.name != null  ? (
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                        <Table.Cell>{props.currentUserInfo?.name}</Table.Cell>
                                        <Table.Cell>{props.name}</Table.Cell>
                                    </Table.Row>
                                ) : (<></>)
                            }
                            {
                                props.password != null ? (
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Password</Table.ColumnHeaderCell>
                                        <Table.Cell>********</Table.Cell>
                                        <Table.Cell>********</Table.Cell>
                                    </Table.Row>
                                ) : (<></>)
                            }
                        </Table.Body>
                    </Table.Root>

                    <div className="flex gap-4 p-4 pt-7 w-ful text-center flex-col">
                        <Text size={"4"}>Type your current password to authorize changes</Text>
                        <TextField.Root size={"3"} type={"password"} onChange={updatePassword} />
                    </div>

                </Inset>

                <div className="flex flex-row justify-between">
                    <AlertDialog.Cancel>
                        <Button size={"4"} variant={"soft"}>Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button size={"4"} type={"submit"} onClick={handleUpdateUser}>Save</Button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}