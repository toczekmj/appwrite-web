'use client'

import FolderButton from "@/components/Files/FolderBrowser/FolderButton";
import {Models} from "appwrite";
import {Button, Card, Separator, Text} from "@radix-ui/themes";
import {FolderUpdateEvent} from "@/Enums/FolderUpdateEvent";
import CreateFolderDialog from "@/components/Files/FolderBrowser/Dialogs/CreateFolderDialog";
import EditFolderDialog from "@/components/Files/FolderBrowser/Dialogs/EditFolderDialog";
import {useAuth} from "@/components/Auth/AuthContext";
import {FolderColumns} from "@/Enums/Database/FolderColumns";
import {CreateFolder, DeleteFolder, UpdateFolder} from "@/lib/Database/Folders";

interface FolderBrowserProps {
    folders: Models.DefaultRow[] | null;
    selectedFolder: string | null;
    onFolderSelect: (event: FolderUpdateEvent, folderId: string | null) => void;
}

export default function FolderBrowser({folders, selectedFolder, onFolderSelect} : FolderBrowserProps) {
    const {currentUserInfo} = useAuth();

    const isSelectedFolder = (id: string) => {
        return selectedFolder === id;
    }

    async function deleteFolder() {
        if (selectedFolder) {
            await DeleteFolder(selectedFolder);
            folders = folders?.filter(row => row[FolderColumns.ID] != selectedFolder) ?? null;
            onFolderSelect(FolderUpdateEvent.Delete, null);
        }
    }

    async function createFolder(name: string | null){
        if (name == null || name == "") {
            console.error("Name is required");
            return;
        }

        const result = await CreateFolder(name, currentUserInfo?.$id ?? "");
        folders?.push(result);
        onFolderSelect(FolderUpdateEvent.Select, result[FolderColumns.ID]);
    }

    async function editFolder(name: string){
        if (name == "" || selectedFolder == null) {
            console.error("Name is required when editing folder");
            return;
        }

        const result = await UpdateFolder(selectedFolder, name);
        console.log(result);
        folders = folders?.filter(f => f.$id != selectedFolder) ?? null;
        folders?.push(result);
        onFolderSelect(FolderUpdateEvent.Update, selectedFolder)
    }

    function getSelectedFolderName() {
        const res = folders?.find(row => row.$id == selectedFolder);
        return res ? res[FolderColumns.ReadableName] : "";
    }

    return (
        <Card>
            <div className={"flex flex-col justify-between gap-3"}>
                <div className={"flex flex-col min-w-50 min-h-120 text-nowrap gap-1.5"}>
                    <Text size={"4"}>Folders</Text>
                    <Separator size={"4"}/>
                    {
                        folders ? (
                            folders.map((folder, index) => (
                                <FolderButton key={index}
                                              label={folder[FolderColumns.ReadableName]}
                                              selected={isSelectedFolder(folder[FolderColumns.ID])}
                                              onFolderClick={() => onFolderSelect(FolderUpdateEvent.Select, folder[FolderColumns.ID])}

                                />
                            ))
                        ) : <></>
                    }
                </div>

                <Separator size={"4"}/>

                <div className={"flex flex-row justify-around gap-3"}>
                    <CreateFolderDialog onAction={createFolder} />

                    <EditFolderDialog disabled={selectedFolder == null}
                                      onAction={editFolder}
                                      folderName={getSelectedFolderName()} />


                    <Button variant={"solid"}
                            color={"red"}
                            disabled={selectedFolder === null}
                            onClick={deleteFolder}
                    >[-]</Button>
                </div>
            </div>
        </Card>
    );
}