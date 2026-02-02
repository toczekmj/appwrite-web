'use client'

import FolderButton from "@/components/Files/FolderBrowser/FolderButton";
import {Button, Card, Separator, Text} from "@radix-ui/themes";
import {FolderUpdateEvent} from "@/Enums/FolderUpdateEvent";
import CreateFolderDialog from "@/components/Files/FolderBrowser/Dialogs/CreateFolderDialog";
import EditFolderDialog from "@/components/Files/FolderBrowser/Dialogs/EditFolderDialog";
import {FolderColumns} from "@/lib/Database/Enums/FolderColumns";
import useFolderBrowserContext, {FolderBrowserProps} from "@/CodeBehind/Components/Files/useFolderBrowserContext";


export default function FolderBrowser(props : FolderBrowserProps) {
    const ctx = useFolderBrowserContext(props)

    return (
        <Card>
            <div className={"flex flex-col justify-between gap-3"}>
                <div className={"flex flex-col min-w-50 min-h-120 text-nowrap gap-1.5"}>
                    <Text size={"4"}>Folders</Text>
                    <Separator size={"4"}/>
                    {
                        ctx.folders ? (
                            ctx.folders.map((folder, index) => (
                                <FolderButton key={index}
                                              label={folder[FolderColumns.ReadableName]}
                                              selected={ctx.isSelectedFolder(folder[FolderColumns.ID])}
                                              onFolderClick={() => ctx.onFolderSelect(FolderUpdateEvent.Select, folder[FolderColumns.ID])}

                                />
                            ))
                        ) : <></>
                    }
                </div>

                <Separator size={"4"}/>

                <div className={"flex flex-row justify-around gap-3"}>
                    <CreateFolderDialog onAction={ctx.createFolder} />

                    <EditFolderDialog disabled={ctx.selectedFolder == null}
                                      onAction={ctx.editFolder}
                                      folderName={ctx.getSelectedFolderName()} />


                    <Button variant={"solid"}
                            color={"red"}
                            disabled={ctx.selectedFolder === null}
                            onClick={ctx.deleteFolder}
                    >[-]</Button>
                </div>
            </div>
        </Card>
    );
}