import { useState } from "react";
import { queryKeys } from "#/lib/tanStack/queryKey";
import { GetFolders } from "#/lib/database/services/FolderService";
import { useQuery } from "@tanstack/react-query";
import { GetFiles } from "#/lib/database/services/FileService";
import { GetCsvFileContent } from "#/lib/bucket/bucket";

export function useChartContext() {
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [selectedFileId, setSelectedFileId] = useState<string>("");

   const folderQuery = useQuery({
        queryKey: queryKeys.folders,
        queryFn: () => GetFolders(),
    });

    const fileQuery = useQuery({
        queryKey: queryKeys.files(selectedFolderId),
        queryFn: () => GetFiles(selectedFolderId),
        enabled: !!selectedFolderId,
    });

    const files = fileQuery.data ?? null;
    const csvFileId = files?.find(file => file.$id === selectedFileId)?.data_file_id ?? null;

    const csvQuery = useQuery({
        queryKey: queryKeys.csv(selectedFileId),
        // REMARK: queryFn intentionally uses csvFileId instead of selectedFileId
        // because we want to fetch the csv file content from the bucket
        // and not from the database
        queryFn: () => GetCsvFileContent(csvFileId),
        enabled: !!csvFileId && !!selectedFileId
    })

    const folders = folderQuery.data ?? null;
    const csvData = csvQuery.data ?? null;
    const loading = folderQuery.isPending ||
                    (!!selectedFolderId && fileQuery.isPending) ||
                    (!!selectedFileId && !!csvFileId && csvQuery.isPending);
    const error = folderQuery.error?.message ??
                  fileQuery.error?.message ??
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