import {ID, Permission, Query, Role} from "appwrite";
import {Table} from "@/Enums/Database/Table";
import {tablesDb} from "@/lib/appwrite";
import {FileColumns} from "@/Enums/Database/FileColumns";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import {DB} from "@/Enums/Database/DB";

export async function GetFile(fileId: string) {
    const response = await tablesDb.listRows({
        databaseId: DB.id,
        tableId: Table.Files,
        queries: [
            Query.equal(FileColumns.ID, fileId)
        ]
    })

    if(response.rows.length > 1){
        throw new Error("Error - there is more than 1 file with given id");
    }

    return response.rows[0];
}

export async function GetFiles(folderId: string)
{
    const result = await tablesDb.listRows({
        databaseId: DB.id,
        tableId: Table.Files,
        queries: [
            Query.equal(FileColumns.Genre, folderId)
        ]
    })

    return result.rows;
}

export async function LinkFile(folderId: string, fileId: string, fileName: string, userId: string){
    return await tablesDb.createRow({
        data: {
            "FileId": fileId,
            "FileName": fileName,
            "genre": folderId,
        },
        databaseId: DB.id,
        rowId: ID.unique(),
        tableId: Table.Files,
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    })
}

export async function DeleteFile(fileId: string) {
    const file = await GetFile(fileId);
    await DeleteFileFromBucket(file[FileColumns.FileID])
    await tablesDb.deleteRow({
        databaseId: DB.id,
        tableId: Table.Files,
        rowId: fileId,
    })
}
