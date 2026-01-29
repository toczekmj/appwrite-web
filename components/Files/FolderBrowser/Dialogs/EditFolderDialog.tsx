import React from 'react';
import {AlertDialog, TextField} from "@radix-ui/themes";
import {Button} from "@radix-ui/themes";
import {FolderEditIcon} from "lucide-react";

interface EditFolderDialogProps {
    onAction: (newName: string) => void;
    folderName: string;
    disabled: boolean;
}

const EditFolderDialog = ({onAction, folderName, disabled}: EditFolderDialogProps) => {
    const [name, setName] = React.useState<string>(folderName);

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button disabled={disabled} color={"blue"}>[...]</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Title>Edit Folder</AlertDialog.Title>

                <div className={"flex flex-col w-full gap-2"}>
                    <TextField.Root placeholder={folderName}
                                    size={"3"}
                                    onChange={(e) => setName(e.target.value)}>
                        <TextField.Slot>
                            <FolderEditIcon/>
                        </TextField.Slot>
                    </TextField.Root>

                    <div className={"flex flex-row w-full justify-between"}>
                        <AlertDialog.Cancel>
                            <Button variant={"outline"}
                                    color={"red"} size={"3"}
                                    style={{padding: "1rem 1.5rem"}}>Cancel</Button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action>
                            <Button onClick={() => onAction?.(name ?? "")}
                                    variant={"outline"} size={"3"}
                                    style={{padding: "1rem 2rem"}}>Save</Button>
                        </AlertDialog.Action>
                    </div>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default EditFolderDialog;