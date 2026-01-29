import React, {useState} from 'react';
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
import {CreateFile} from "@/lib/bucket";
import {useAuth} from "@/components/Auth/AuthContext";
import {LinkFileToFolder} from "@/lib/genresDb";

interface UploadFilesDialogProps {
    folderId: string;
    onClose: () => void;
}

function UploadFilesDialog({folderId, onClose}: UploadFilesDialogProps) {
    const [files, setFiles] = useState<File[]>([]);
    const {currentUserInfo} = useAuth();
    const onUpload = React.useCallback(
        async (
            files: File[],
            {
                onProgress,
                onSuccess,
                onError,
            }: {
                onProgress: (file: File, progress: number) => void;
                onSuccess: (file: File) => void;
                onError: (file: File, error: Error) => void;
            },
        ) => {
            try {
                const uploadFileAndCreateDbLink = async (file: File, userId: string, folder: string) => {
                    const createdFile = await CreateFile(file, userId, (progressData) => {
                        const percentage = (progressData.chunksUploaded / progressData.chunksTotal) * 100;
                        onProgress(file, percentage);
                    })
                    console.log(createdFile);
                    await LinkFileToFolder(folder, createdFile.$id, createdFile.name, userId);
                }


                const uploadPromises = files.map(async (file) => {
                    try {
                        const userId = currentUserInfo?.$id;

                        if (!userId) {
                            throw new Error("Could not find user");
                        }

                        await uploadFileAndCreateDbLink(file, userId, folderId);


                        onSuccess(file);
                    } catch (error) {
                        onError(
                            file,
                            error instanceof Error ? error : new Error("Upload failed"),
                        );
                    }
                });

                await Promise.all(uploadPromises);
            } catch (error) {
                console.error("Unexpected error during upload:", error);
            }
        },
        [currentUserInfo?.$id, folderId],
    );

    const onFileReject = React.useCallback((file: File, message: string) => {
        console.log(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button onClick={() => {
                }}>Upload</Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <AlertDialog.Title>Upload files</AlertDialog.Title>
                <FileUpload
                    maxFiles={20}
                    className={"w-full"}
                    onAccept={(files) => setFiles(files)}
                    onUpload={onUpload}
                    onFileReject={onFileReject}
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
                        {files.map((file, index) => (
                            <FileUploadItem key={index} value={file} className="flex-col">
                                <div className="flex w-full items-center gap-2">
                                    <FileUploadItemPreview/>
                                    <FileUploadItemMetadata/>
                                    {/*<FileUploadItemDelete asChild>*/}
                                    {/*    <Button variant="ghost" size="1">*/}
                                    {/*        <X/>*/}
                                    {/*    </Button>*/}
                                    {/*</FileUploadItemDelete>*/}
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