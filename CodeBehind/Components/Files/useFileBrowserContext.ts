import {useEffect, useState} from "react";
import {DeleteFile, GetFiles} from "@/lib/Database/Services/FileService";
import {Models} from "appwrite";

function useFileBrowserContext(folderId: string | null) {
    const [files, setFiles] = useState<Models.DefaultRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!folderId) {
            setFiles([]);
            return;
        }
        fetchFiles();
    }, [folderId]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            if (folderId) {
                const result = await GetFiles(folderId)
                setFiles(result);
            }
        } catch (error) {
            console.log(error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadComplete = () => {
        fetchFiles();
    }

    const deleteFile = async (id: string) => {
        try {
            await DeleteFile(id);
            const newFiles = files.filter((f) => f.$id !== id);
            setFiles(newFiles);
        }
        catch (error) {
            // TODO: handle this error properly
        }
    }

    return {
        files,
        setFiles,
        loading,
        setLoading,
        fetchFiles,
        handleUploadComplete,
        deleteFile,
    }
}

export {
    useFileBrowserContext,
}