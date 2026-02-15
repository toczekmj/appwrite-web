import {useEffect, useMemo, useState} from "react";
import {DeleteFile, GetFiles} from "@/lib/Database/Services/FileService";
import {Models} from "appwrite";
import {useAuth} from "@/components/Auth/AuthContext";
import {ExecuteFftInBackground} from "@/lib/Functions/functions";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import { IsComputationOngoing } from "@/lib/Database/Services/FolderService";

function useFileBrowserContext(folderId: string | null) {
    const [files, setFiles] = useState<Models.DefaultRow[]>([]);
    const [loading, setLoading] = useState(false);
    const {currentUserInfo} = useAuth();
    const computedCount = useMemo(() => {
        return files.reduce((acc, file) =>
            acc + (file[FileColumns.CsvDataFileID] !== null && file[FileColumns.CsvDataFileID] !== undefined && file[FileColumns.CsvDataFileID] !== "" ? 1 : 0), 0);
    }, [files]);
    const filesCount = useMemo(() => files.length, [files]);

    const [isComputing, setIsComputing] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;
        let pollTimer: ReturnType<typeof setInterval> | null = null;

        async function checkStatus() {
            if (!folderId) {
                if (mounted) setIsComputing(false);
                return;
            }
            try {
                const ongoing = await IsComputationOngoing(folderId);
                if (mounted) setIsComputing(ongoing);
            } catch (err) {
                console.error(err);
                if (mounted) setIsComputing(false);
            }
        }

        // initial check + start polling
        checkStatus();
        pollTimer = setInterval(checkStatus, 3000);

        return () => {
            mounted = false;
            if (pollTimer) clearInterval(pollTimer);
        };
    }, [folderId]);

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
        if (folderId && currentUserInfo) {
            // optimistic UI: disable button immediately
            setIsComputing(true);
            try {
                const res = await ExecuteFftInBackground(folderId, currentUserInfo.$id);
                console.log(res);
            } catch (err) {
                console.error(err);
                // re-check actual status if background invocation failed
                const ongoing = await IsComputationOngoing(folderId).catch(() => false);
                setIsComputing(ongoing);
            }
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
        isComputing,
    }
}

export {
    useFileBrowserContext,
}