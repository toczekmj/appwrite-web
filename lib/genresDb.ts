import {tablesDb} from "@/lib/appwrite";
import {ID, Permission, Query, Role} from "appwrite";
import {createFileSlug} from "@/lib/slugify";
import {DeleteFileFromBucket} from "@/lib/bucket";

export enum FolderColumns {
    "ID" = "$id",
    "CreatedAt" = "$createdAt",
    "UpdatedAt" = "$updatedAt",
    "ReadableName" = "ReadableName",
    "Slug" = "Slug",
    "Samples" = "samples",
}

const dbId = "697a22dd0016001f7e6b"

// TODO: fetch dbid and tableid from .env
// TODO: add error handling

export async function GetFolders(){
    const result = await tablesDb.listRows({
        databaseId: dbId,
        tableId: "genres",
        queries: [
            Query.select([FolderColumns.ReadableName, FolderColumns.Slug]),
            Query.orderDesc(FolderColumns.UpdatedAt),
        ],
    });

    return result.rows;
}

export async function GetFileNamesInFolder(folderId: string)
{
    const result = await tablesDb.listRows({
        databaseId: dbId,
        tableId: "files",
        queries: [
            Query.equal("genre", folderId)
        ]
    })

    return result.rows;
}

export async function DeleteFolder(folderId: string) {
    const files = await GetFileNamesInFolder(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file["FileId"])
    }

    await tablesDb.deleteRow({
        databaseId: dbId,
        tableId: "genres",
        rowId: folderId,
    })
}

export async function DeleteSingleFileFromFolder(fileId: string) {
    console.log(`Deleting ${fileId}`);
    const file = await GetSingleFile(fileId);
    console.log(`Deleting ${file}`);
    await DeleteFileFromBucket(file["FileId"])
    await tablesDb.deleteRow({
        databaseId: dbId,
        tableId: "files",
        rowId: fileId,
    })
}

export async function GetSingleFile(fileId: string) {
    const response = await tablesDb.listRows({
        databaseId: dbId,
        tableId: "files",
        queries: [
            Query.equal("$id", fileId)
        ]
    })

    if(response.rows.length > 1){
        throw new Error("Error - there is more than 1 file with given id");
    }

    return response.rows[0];
}

export async function CreateFolder(folderName: string, userId: string) {
    return await tablesDb.createRow({
        rowId: ID.unique(),
        databaseId: dbId,
        tableId: "genres",
        data: {
            "ReadableName": folderName,
            "Slug": createFileSlug(folderName, userId),
        },
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.delete(Role.user(userId)),
        ]
    });
}

export async function UpdateFolder(folderId: string, folderName: string) {
    return await tablesDb.updateRow({
        databaseId: dbId,
        tableId: "genres",
        rowId: folderId,
        data: {
            "ReadableName": folderName,
        }
    })
}

export async function LinkFileToFolder(folderId: string, fileId: string, fileName: string, userId: string){
    console.log("Folder id " + folderId);
    console.log("File id " + fileId);
    return await tablesDb.createRow({
        data: {
            "FileId": fileId,
            "FileName": fileName,
            "genre": folderId,
        },
        databaseId: dbId,
        rowId: ID.unique(),
        tableId: "files",
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    })
}
