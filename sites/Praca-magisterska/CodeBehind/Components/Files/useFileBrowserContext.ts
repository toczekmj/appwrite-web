import {useEffect, useMemo, useState} from "react";
import {DeleteFile, GetFiles} from "@/lib/Database/Services/FileService";
import {Models} from "appwrite";
import {useAuth} from "@/components/Auth/AuthContext";
import {ExecuteFftInBackground} from "@/lib/Functions/functions";
import {account} from "@/lib/appwrite";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";

function useFileBrowserContext(folderId: string | null) {
    const [files, setFiles] = useState<Models.DefaultRow[]>([]);
    const [loading, setLoading] = useState(false);
    const {currentUserInfo} = useAuth();
    const computedCount = useMemo(() => {
        return files.reduce((acc, file) =>
            acc + (file[FileColumns.IsTransformed] === true ? 1 : 0), 0);
    }, [files]);
    const filesCount = useMemo(() => files.length, [files]);

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

    const computeFiles = async () => {
        const token = await account.createJWT();
        for (const file of files) {
            await ExecuteFftInBackground(file.$id, token.jwt)
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
        currentUserInfo,
        computeFiles,
        computedCount,
        filesCount,
    }
}

export {
    useFileBrowserContext,
}