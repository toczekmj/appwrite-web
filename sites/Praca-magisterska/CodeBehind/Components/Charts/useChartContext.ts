import { GetCsvFileContent } from "@/lib/Bucket/bucket";
import { GetFiles } from "@/lib/Database/Services/FileService";
import { GetFolders } from "@/lib/Database/Services/FolderService";
import { queryKeys } from "@/lib/TanStack/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useChartContext() {
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [selectedFileId, setSelectedFileId] = useState<string>("");

    const folderQuery = useQuery({
        queryKey: queryKeys.folders,
        queryFn: () => GetFolders(),
    });

    const filesQuery = useQuery({
        queryKey: queryKeys.files(selectedFolderId),
        queryFn: () => GetFiles(selectedFolderId),
        enabled: !!selectedFolderId,
    });

    const files = filesQuery.data ?? null;
    const csvFileId = files?.find(file => file.$id === selectedFileId)?.data_file_id ?? null;

    const csvQuery = useQuery({
        queryKey: queryKeys.csvContent(selectedFileId),
        // REMARK: queryFn intentionally uses csvFileId to fetch data from bucket, not selectedFileId
        // this is because selectedFileId is the id of the file in the database,
        // while csvFileId is the id of the file in the bucket (selectedFile has data_file_id field)
        queryFn: () => GetCsvFileContent(csvFileId),
        enabled: !!csvFileId && !!selectedFileId,
    });

    const folders = folderQuery.data ?? null;
    const csvData = csvQuery.data ?? null;
    const loading = 
        folderQuery.isPending ||
        (!!selectedFolderId && filesQuery.isPending) ||
        (!!selectedFileId && !!csvFileId && csvQuery.isPending);
    const error = folderQuery.error?.message ??
        filesQuery.error?.message ?? 
        csvQuery.error?.message ?? null;


    return {
        csvData,
        selectedFileId,
        setSelectedFileId,
        selectedFolderId,
        setSelectedFolderId,
        folders,
        files,
        error,
        loading,
    }
}