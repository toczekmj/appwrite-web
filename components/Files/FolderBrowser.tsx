'use client'

import FolderButton from "@/components/Files/FolderButton";
import {Models} from "appwrite";
import {GenreColumns} from "@/lib/genresDb";
import {Text, Card, Separator} from "@radix-ui/themes";
import {useState} from "react";

interface FolderBrowserProps {
    folders: Models.DefaultRow[];
}

export default function FolderBrowser({folders} : FolderBrowserProps) {
    const [selectedFolder, setSelectedFolder] = useState<Models.DefaultRow>();

    const isSelectedFolder = (folder: Models.DefaultRow) => {
        return selectedFolder === folder;
    }

    return (
        <Card>
            <div className={"flex flex-col min-w-50 min-h-120 text-nowrap gap-1.5"}>
                <Text size={"4"}>Folders</Text>
                <Separator size={"4"}/>
                {
                    folders ? (
                        folders.map((genre, index) => (
                            <FolderButton key={index}
                                          label={genre[GenreColumns.ReadableName]}
                                          selected={isSelectedFolder(genre[GenreColumns.ReadableName])}
                                          onFolderClick={() => setSelectedFolder(genre[GenreColumns.ReadableName])}

                            />
                        ))
                    ) : <></>
                }
            </div>
        </Card>
    );
}