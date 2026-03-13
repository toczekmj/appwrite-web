import type { Genres } from "#/generated/appwrite/types";
import { GetFolders } from "#/lib/database/services/FolderService";
import { queryKeys } from "#/lib/tanStack/queryKey";
import { useQuery } from "@tanstack/react-query";

export type UseFoldersQueryResult = {
    data: Genres[] | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
}

export function useFoldersQuery(): UseFoldersQueryResult {
    const response = useQuery({
        queryKey: queryKeys.folders,
        queryFn: () => GetFolders(),
    });

    const result: UseFoldersQueryResult = {
        data: response.data ?? null,
        isLoading: response.isLoading,
        isError: response.isError,
        errorMessage: response.error?.message ?? null,
    }

    return result;
}