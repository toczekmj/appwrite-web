import {FolderColumns} from "@/lib/Database/Enums/FolderColumns";
import {tablesDb} from "@/lib/Database/appwrite";
import {Query} from "appwrite";
import {createFileSlug} from "@/lib/slugify";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {Table} from "@/lib/Database/Enums/Table";
import {Database} from "@/lib/Database/Enums/Database";
import {GetFiles} from "@/lib/Database/Services/FileService";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import {GetAsync, PatchAsync, PostAsync} from "@/lib/Database/Repository/appwriteRepo";

export async function GetFolders() {
    const query = [
        Query.select([FolderColumns.ReadableName, FolderColumns.Slug]),
        Query.orderDesc(FolderColumns.UpdatedAt),
    ];
    const result = await GetAsync(Database.id, Table.Folders, query);
    return result.rows;
}

export async function CreateFolder(folderName: string, userId: string) {
    const data = {
        "ReadableName": folderName,
        "Slug": createFileSlug(folderName, userId),
    };
    return await PostAsync(Database.id, Table.Folders, data, userId);
}

export async function UpdateFolder(folderId: string, folderName: string) {
    const data = {
        "ReadableName": folderName,
    };
    return PatchAsync(Database.id, Table.Folders, folderId, data)
}

export async function DeleteFolder(folderId: string) {
    const files = await GetFiles(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file[FileColumns.FileID])
    }

    await tablesDb.deleteRow({
        databaseId: Database.id,
        tableId: Table.Folders,
        rowId: folderId,
    })
}