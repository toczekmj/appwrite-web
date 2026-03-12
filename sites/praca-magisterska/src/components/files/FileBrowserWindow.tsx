import {Card} from "@radix-ui/themes";
import FolderBrowser from "#/components/files/FolderBrowser/FolderBrowser";
import FileBrowser from "#/components/files/FileBrowser/FileBrowser";
import React from "react";
import {FolderUpdateEvent} from "#/enums/FolderUpdateEvent";
import type { Genres } from "#/generated/appwrite/types";

interface FileBrowserWindowProps {
    folders: Genres[] | null;
    onFolderModify: (event: FolderUpdateEvent) => void;
}

export default function FileBrowserWindow({folders, onFolderModify}: FileBrowserWindowProps) {
    const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);

    const onFolderUpdateEvent = (event: FolderUpdateEvent, folderId: string | null) => {
        switch (event) {
            case FolderUpdateEvent.Select:
                setSelectedFolder(folderId);
                onFolderModify(FolderUpdateEvent.Select)
                break;
            case FolderUpdateEvent.Delete:
                onFolderModify(FolderUpdateEvent.Delete);
                setSelectedFolder(null);
                break;
            case FolderUpdateEvent.Create:
                onFolderModify(FolderUpdateEvent.Create);
                setSelectedFolder(folderId);
                break;
            case FolderUpdateEvent.Update:
                onFolderModify(FolderUpdateEvent.Update);
                break;
            default:
                break;
        }
    }

    return (
        <Card size="3">
            <div className={"flex flex-row gap-2"}>
                <div className={"min-w-[22%]"}>
                    <FolderBrowser
                        selectedFolder={selectedFolder}
                        onFolderSelect={onFolderUpdateEvent}
                        folders={folders}/>
                </div>
                <div className={"min-w-[78%]"}>
                    <FileBrowser folderId={selectedFolder}/>
                </div>
            </div>
        </Card>
    );
}