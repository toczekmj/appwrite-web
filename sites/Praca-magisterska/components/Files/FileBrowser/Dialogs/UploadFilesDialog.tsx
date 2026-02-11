import React from 'react';
import {AlertDialog, Button} from "@radix-ui/themes";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemProgress,
    FileUploadList,
    FileUploadTrigger
} from "@/components/ui/file-upload";
import {UploadIcon} from "lucide-react";
import {useUploadFilesDialogContext} from "@/CodeBehind/Components/Files/useUploadFilesDialogContext";

interface UploadFilesDialogProps {
    folderId: string;
    onClose: () => void;
}

function UploadFilesDialog({folderId, onClose}: UploadFilesDialogProps) {
    const ctx = useUploadFilesDialogContext(folderId);

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button onClick={() => {
                }}>Upload</Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <div className={"flex gap-5 justify-between items-center-safe"}>
                    <AlertDialog.Title>Upload files</AlertDialog.Title>
                    <AlertDialog.Description>Upload files to folder</AlertDialog.Description>
                </div>
                <FileUpload
                    maxFiles={20}
                    className={"w-full"}
                    onAccept={(files) => ctx.setFiles(files)}
                    onUpload={ctx.onUpload}
                    onFileReject={ctx.onFileReject}
                    multiple>
                    <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <div className="flex items-center justify-center rounded-full border p-2.5">
                                <UploadIcon className="size-6 text-muted-foreground"/>
                            </div>
                            <p className="font-medium text-sm">Drag & drop files here</p>
                            <p className="text-muted-foreground text-xs">
                                Or click to browse (max 20 files, up to 3GB each)
                            </p>
                        </div>
                        <FileUploadTrigger asChild>
                            <Button variant="outline" size="4" className="mt-2 w-fit">
                                Browse files
                            </Button>
                        </FileUploadTrigger>
                    </FileUploadDropzone>
                    <FileUploadList>
                        {ctx.files.map((file, index) => (
                            <FileUploadItem key={index} value={file} className="flex-col">
                                <div className="flex w-full items-center gap-2">
                                    <FileUploadItemPreview/>
                                    <FileUploadItemMetadata/>
                                </div>
                                <FileUploadItemProgress/>
                            </FileUploadItem>
                        ))}
                    </FileUploadList>
                </FileUpload>
                <div className="flex flex-row items-center justify-center pt-4">
                    <AlertDialog.Cancel>
                        <Button size={"4"} onClick={onClose}>Close</Button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}

export default UploadFilesDialog;