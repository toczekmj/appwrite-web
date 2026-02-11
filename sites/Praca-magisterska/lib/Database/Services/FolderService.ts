import {FolderColumns} from "@/lib/Database/Enums/FolderColumns";
import {tablesDb} from "@/lib/appwrite";
import {Query} from "appwrite";
import {createFileSlug} from "@/lib/slugify";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {Table} from "@/lib/Database/Enums/Table";
import {GetFiles} from "@/lib/Database/Services/FileService";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import {GetAsync, PatchAsync, PostAsync} from "@/lib/Database/Repository/appwriteRepo";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;

export async function GetFolders() {
    const query = [
        Query.select([FolderColumns.ReadableName, FolderColumns.Slug]),
        Query.orderDesc(FolderColumns.UpdatedAt),
    ];
    const result = await GetAsync(databaseId, Table.Folders, query);
    return result.rows;
}

export async function CreateFolder(folderName: string, userId: string) {
    const data = {
        "ReadableName": folderName,
        "Slug": createFileSlug(folderName, userId),
    };
    return await PostAsync(databaseId, Table.Folders, data, userId);
}

export async function UpdateFolder(folderId: string, folderName: string) {
    const data = {
        "ReadableName": folderName,
    };
    return PatchAsync(databaseId, Table.Folders, folderId, data)
}

export async function DeleteFolder(folderId: string) {
    const files = await GetFiles(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file[FileColumns.FileID])
    }

    await tablesDb.deleteRow({
        databaseId: databaseId,
        tableId: Table.Folders,
        rowId: folderId,
    })
}