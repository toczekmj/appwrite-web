import React from 'react';
import {AlertDialog, Button, TextField} from "@radix-ui/themes";
import {FolderPlusIcon} from "lucide-react";

interface CreateFolderDialogProps {
    onAction: (name: string | null) => void;
}

const CreateFolderDialog = ({onAction}: CreateFolderDialogProps) => {
    const [name, setName] = React.useState<string | null>(null);

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button>[+]</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Title>
                    Create new folder
                </AlertDialog.Title>

                <div className={"flex flex-col min-w-min gap-2"}>
                    <TextField.Root placeholder={"Create folder..."}
                                    size={"3"}
                                    onChange={(e) => setName(e.target.value)}>
                        <TextField.Slot>
                            <FolderPlusIcon/>
                        </TextField.Slot>
                    </TextField.Root>

                    <div className={"flex flex-row w-full gap-5 justify-between"}>
                        <AlertDialog.Cancel>
                            <Button variant={"outline"}
                                    color={"red"} size={"3"}
                                    style={{padding: "1rem 1.5rem"}}>Cancel</Button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action>
                            <Button onClick={() => onAction(name)}
                                    variant={"outline"}
                                    size={"3"}
                                    style={{padding: "1rem 2rem"}}>Save</Button>
                        </AlertDialog.Action>
                    </div>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default CreateFolderDialog;