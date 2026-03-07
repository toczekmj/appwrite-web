'use client'

import FileBrowserWindow from "@/components/Files/FileBrowserWindow";
import {useEffect, useState} from "react";
import {FolderUpdateEvent} from "@/Enums/FolderUpdateEvent";
import {GetFolders} from "@/lib/Database/Services/FolderService";
import { Genres } from "@/Generated/appwrite";

export default function Files() {

    const [folders, setFolders] = useState<Genres[] | null>(null);
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