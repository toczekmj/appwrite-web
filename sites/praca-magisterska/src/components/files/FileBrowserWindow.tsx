import {Card} from "@radix-ui/themes";
import FolderBrowser from "#/components/files/FolderBrowser/FolderBrowser";
import FileBrowser from "#/components/files/FileBrowser/FileBrowser";
import React from "react";
import type { Genres } from "#/generated/appwrite/types";
import { queryKeys } from "#/lib/tanStack/queryKey";
import { useQueryClient } from "@tanstack/react-query";

interface FileBrowserWindowProps {
    folders: Genres[] | null;
}

export default function FileBrowserWindow({folders}: FileBrowserWindowProps) {
    const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleFolderInvalidate = () => {
        queryClient.invalidateQueries({queryKey: queryKeys.folders});
    }

    return (
        <Card size="3">
            <div className={"flex flex-row gap-2"}>
                <div className={"min-w-[22%]"}>
                    <FolderBrowser
                        onFolderInvalidate={handleFolderInvalidate}
                        selectedFolder={selectedFolder}
                        onFolderSelect={(id) => setSelectedFolder(id)}
                        folders={folders}/>
                </div>
                <div className={"min-w-[78%]"}>
                    <FileBrowser folderId={selectedFolder}/>
                </div>
            </div>
        </Card>
    );
}