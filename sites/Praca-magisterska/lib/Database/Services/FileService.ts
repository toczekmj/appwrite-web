import { Query } from "appwrite";
import { Table } from "@/lib/Database/Enums/Table";
import { FileColumns } from "@/lib/Database/Enums/FileColumns";
import { DeleteFileFromBucket } from "@/lib/Bucket/bucket";
import { DeleteAsync, ListAsync, PostAsync } from "@/lib/Database/Repository/appwriteRepo";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;

export async function GetFile(fileId: string) {
    const query = Query.equal(FileColumns.ID, fileId);
    const response = await ListAsync(databaseId, Table.Files, [query]);
    if (response.rows.length > 1) {
        throw new Error("Error - there is more than 1 file with given id");
    }
    return response.rows[0];
}

export async function GetFiles(folderId: string) {
    const query = Query.equal(FileColumns.Genre, folderId);
    const result = await ListAsync(databaseId, Table.Files, [query]);
    return result.rows;
}

export async function LinkFile(folderId: string, fileId: string, fileName: string, userId: string) {
    const data = {
        "FileId": fileId,
        "FileName": fileName,
        "genre": folderId,
    };

    return await PostAsync(databaseId, Table.Files, data, userId)
}

export async function DeleteFile(fileId: string) {
    const file = await GetFile(fileId);
    const hasCsvData = file[FileColumns.CsvDataFileID];
    const hasFile = file[FileColumns.FileID];
    if (hasCsvData) {
        console.log('has csv')
        await DeleteFileFromBucket(file[FileColumns.CsvDataFileID])
    }
    if (hasFile) {
        console.log('has file')
        await DeleteFileFromBucket(file[FileColumns.FileID])
    } await DeleteAsync(databaseId, Table.Files, fileId)
}
