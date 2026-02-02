'use client'

import FileBrowserWindow from "@/components/Files/FileBrowserWindow";
import {useEffect, useState} from "react";
import {Models} from "appwrite";
import {FolderUpdateEvent} from "@/Enums/FolderUpdateEvent";
import {GetFolders} from "@/lib/Database/Services/FolderService";

export default function Files() {

    const [folders, setFolders] = useState<Models.DefaultRow[] | null>(null);
    const [event, setEvent] = useState<FolderUpdateEvent | null>(null);

    useEffect(() => {
        if (event != FolderUpdateEvent.Select){
            GetFolders().then(v => setFolders(v));
        }
    }, [event])

    return (
        <div className="flex grow flex-col">
            <FileBrowserWindow
                folders={folders}
                onFolderModify={setEvent}
            />
        </div>
    );
}