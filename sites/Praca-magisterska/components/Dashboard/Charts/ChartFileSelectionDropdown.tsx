'use client'

import { FileColumns } from "@/lib/Database/Enums/FileColumns";
import { FolderColumns } from "@/lib/Database/Enums/FolderColumns";
import { Select } from "@radix-ui/themes";
import { Models } from "appwrite";
import { Dispatch, SetStateAction } from "react";

export interface ChartFileSelectionDropdownProps {
    folders: Models.DefaultRow[] | null
    files: Models.DefaultRow[] | null
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
                                    <Select.Group key={folder[FolderColumns.ID]}>
                                        <Select.Item value={folder[FolderColumns.ID]}>
                                            {folder[FolderColumns.ReadableName]}
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
                                    <Select.Group key={file[FileColumns.ID]}>
                                        <Select.Item value={file[FileColumns.ID]} disabled={!file[FileColumns.CsvDataFileID]}>
                                            {file[FileColumns.FileName]}
                                            {file[FileColumns.CsvDataFileID] ? "" : " (CSV not ready)"}
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