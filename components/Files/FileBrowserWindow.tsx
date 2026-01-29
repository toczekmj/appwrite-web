'use client'

import {Card} from "@radix-ui/themes";
import FolderBrowser from "@/components/Files/FolderBrowser/FolderBrowser";
import FileBrowser from "@/components/Files/FileBrowser/FileBrowser";
import {Models} from "appwrite";
import React from "react";
import {FolderUpdateEvent} from "@/app/Enums/FolderUpdateEvent";

interface FileBrowserWindowProps {
    folders: Models.DefaultRow[] | null;
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
                <FolderBrowser
                    selectedFolder={selectedFolder}
                    onFolderSelect={onFolderUpdateEvent}
                    folders={folders}/>
                <FileBrowser folderId={selectedFolder}/>
            </div>
        </Card>
    );
}