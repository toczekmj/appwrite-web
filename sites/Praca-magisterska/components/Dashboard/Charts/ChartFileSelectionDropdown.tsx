'use client'

import { Files, Genres } from "@/Generated/appwrite";
import { Select } from "@radix-ui/themes";
import { Dispatch, SetStateAction } from "react";

export interface ChartFileSelectionDropdownProps {
    folders: Genres[] | null
    files: Files[] | null
    folderId: string;
    fileId: string;
    setFolderId: Dispatch<SetStateAction<string>>,
    setFileId: Dispatch<SetStateAction<string>>,
}

export default function ChartFileSelectionDropdown(
    { folders, files, folderId, fileId, setFolderId, setFileId }
        : ChartFileSelectionDropdownProps
) {
    return (
        <div className="flex flex-col gap-3 px-3">
            {/* folder selection */}
            {
                folders ? (
                    <Select.Root
                        value={folderId}
                        onValueChange={(val) => {
                            setFileId('');
                            setFolderId(val)
                        }}>
                        <Select.Trigger placeholder="Pick a folder" />
                        <Select.Content position="popper">
                            {
                                folders.map(folder => (
                                    <Select.Group key={folder.$id}>
                                        <Select.Item value={folder.$id}>
                                            {folder.ReadableName}
                                        </Select.Item>
                                    </Select.Group>
                                ))
                            }
                        </Select.Content>
                    </Select.Root>
                ) : <></>
            }

            {/* file selection */}
            {
                files ? (
                    <Select.Root
                        value={fileId}
                        onValueChange={(val) => setFileId(val)}>
                        <Select.Trigger placeholder="Pick a file" />
                        <Select.Content position="popper">
                            {
                                files.map((file) => (
                                    <Select.Group key={file.$id}>
                                        <Select.Item value={file.$id} disabled={!file.data_file_id}>
                                            {file.FileName}
                                            {file.data_file_id ? "" : " (CSV not ready)"}
                                        </Select.Item>
                                    </Select.Group>
                                ))
                            }
                        </Select.Content>
                    </Select.Root>
                ) : <></>
            }
        </div>

    );
}