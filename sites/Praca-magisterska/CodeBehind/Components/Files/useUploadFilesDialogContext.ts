import React, {useState} from 'react';
import {useAuth} from "@/components/Auth/AuthContext";
import {LinkFile} from "@/lib/Database/Services/FileService";
import {CreateFileInBucket} from "@/lib/Bucket/bucket";

function useUploadFilesDialogContext(folderId: string) {
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
                    const createdFile = await CreateFileInBucket(file, userId, (progressData) => {
                        const percentage = (progressData.chunksUploaded / progressData.chunksTotal) * 100;
                        onProgress(file, percentage);
                    })
                    console.log(createdFile);
                    await LinkFile(folder, createdFile.$id, createdFile.name, userId);
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

    return {
        files,
        setFiles,
        onFileReject,
        onUpload,
    }
}

export { useUploadFilesDialogContext };
