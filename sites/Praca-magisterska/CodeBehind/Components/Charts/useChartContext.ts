import { FrequencyData } from "@/components/Dashboard/Charts/FrequencyChart";
import { GetCsvFileContent } from "@/lib/Bucket/bucket";
import { FileColumns } from "@/lib/Database/Enums/FileColumns";
import { GetFile, GetFiles } from "@/lib/Database/Services/FileService";
import { GetFolders } from "@/lib/Database/Services/FolderService";
import { Models } from "appwrite";
import { useEffect, useState } from "react";

export function useChartContext() {
    const [folders, setFolders] = useState<Models.DefaultRow[] | null>(null);
    const [files, setFiles] = useState<Models.DefaultRow[] | null>(null);
    const [csvData, setCsvData] = useState<FrequencyData[] | null>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [csvCache, setCsvCache] = useState<Record<string, FrequencyData[]>>({});
 
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [selectedFileId, setSelectedFileId] = useState<string>("");

    useEffect(() => {tryLoad(getFolders, "Failed to fetch folders.")}, [])
    useEffect(() => {tryLoad(getFiles, "Failed to fetch files.")}, [selectedFolderId])
    useEffect(() => {tryLoad(getDataFromBucket, "Failed to fetch files.")}, [selectedFileId])

    async function getFolders() {
        const folders = await GetFolders();
        setFolders(folders);
    }

    async function getFiles() {
        if (!selectedFolderId) return;
        const files = await GetFiles(selectedFolderId);
        setFiles(files);
    }

    async function getDataFromBucket() {
        if (!selectedFileId) return;

        // 1. check cache
        const cached = csvCache[selectedFileId];
        if (cached) {
            console.log("there was a cache for this file");
            setCsvData(cached);
            return;
        }

        // 2. fetch from backend
        const csvid = files
            ?.find(file => file[FileColumns.ID] === selectedFileId)
            ?.[FileColumns.CsvDataFileID];
        const csv = await GetCsvFileContent(csvid);

        // 3. set cache
        setCsvCache(prev => ({...prev, [selectedFileId]: csv}))
        setCsvData(csv);
    }

    async function tryLoad(func: () => Promise<void>, errorMsg?: string) {
        setError(null);
        setLoading(true);
        try {
            await func();
            setError(null);
        }
        catch (err: any){
            setError(err.message || errorMsg)
        }
        finally {
            setLoading(false);
        }
    }

    return {
        csvData,
        setCsvData,
        selectedFileId,
        setSelectedFileId,
        selectedFolderId,
        setSelectedFolderId,
        folders,
        files,
        error,
        loading,
        getFolders,
        GetFile,
        getDataFromBucket,
        tryLoad,
    }
}