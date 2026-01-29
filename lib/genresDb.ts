import {tablesDb} from "@/lib/appwrite";
import {ID, Query} from "appwrite";

export enum FolderColumns {
    "ID" = "$id",
    "CreatedAt" = "$createdAt",
    "UpdatedAt" = "$updatedAt",
    "ReadableName" = "ReadableName",
    "Slug" = "Slug",
    "Samples" = "samples",
}

// TODO: fetch dbid and tableid from .env
// TODO: add error handling

export async function GetFolders(){
    const result = await tablesDb.listRows({
        databaseId: "697a22dd0016001f7e6b",
        tableId: "genres",
        queries: [
            Query.select([FolderColumns.ReadableName, FolderColumns.Slug]),
            Query.orderDesc(FolderColumns.UpdatedAt),
        ],
    });

    return result.rows;
}

export async function GetFiles(folderId: string)
{
    const result = await tablesDb.listRows({
        databaseId: "697a22dd0016001f7e6b",
        tableId: "files",
        queries: [
            Query.equal("genre", folderId),
        ]
    })

    return result.rows;
}

export async function DeleteFolder(folderId: string) {
    await tablesDb.deleteRow({
        databaseId: "697a22dd0016001f7e6b",
        tableId: "genres",
        rowId: folderId,
    })
}

export async function CreateFolder(folderName: string) {
    return await tablesDb.createRow({
        rowId: ID.unique(),
        databaseId: "697a22dd0016001f7e6b",
        tableId: "genres",
        data: {
            "ReadableName": folderName,
            "Slug": folderName + "-slug",
        }
        // TODO: create function that creates slug out of folder name
    });
}

export async function UpdateFolder(folderId: string, folderName: string) {
    return await tablesDb.updateRow({
        databaseId: "697a22dd0016001f7e6b",
        tableId: "genres",
        rowId: folderId,
        data: {
            "ReadableName": folderName,
        }
    })
}