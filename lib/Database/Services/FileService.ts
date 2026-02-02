import {Query} from "appwrite";
import {Table} from "@/lib/Database/Enums/Table";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import {Database} from "@/lib/Database/Enums/Database";
import {DeleteAsync, GetAsync, PostAsync} from "@/lib/Database/Repository/appwriteRepo";

export async function GetFile(fileId: string) {
    const query = Query.equal(FileColumns.ID, fileId);
    const response = await GetAsync(Database.id, Table.Files, [query]);
    if (response.rows.length > 1) {
        throw new Error("Error - there is more than 1 file with given id");
    }
    return response.rows[0];
}

export async function GetFiles(folderId: string) {
    const query = Query.equal(FileColumns.Genre, folderId);
    const result = await GetAsync(Database.id, Table.Files, [query]);
    return result.rows;
}

export async function LinkFile(folderId: string, fileId: string, fileName: string, userId: string) {
    const data = {
        "FileId": fileId,
        "FileName": fileName,
        "genre": folderId,
    };

    return await PostAsync(Database.id, Table.Files, data, userId)
}

export async function DeleteFile(fileId: string) {
    const file = await GetFile(fileId);
    await DeleteFileFromBucket(file[FileColumns.FileID])
    await DeleteAsync(Database.id, Table.Files, fileId)
}
