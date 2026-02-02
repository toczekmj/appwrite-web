import {FolderColumns} from "@/Enums/Database/FolderColumns";
import {tablesDb} from "@/lib/appwrite";
import {ID, Permission, Query, Role} from "appwrite";
import {createFileSlug} from "@/lib/slugify";
import {FileColumns} from "@/Enums/Database/FileColumns";
import {Table} from "@/Enums/Database/Table";
import {DB} from "@/Enums/Database/DB";
import {GetFiles} from "@/lib/Database/Files";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";

export async function GetFolders(){
    const result = await tablesDb.listRows({
        databaseId: DB.id,
        tableId: Table.Folders,
        queries: [
            Query.select([FolderColumns.ReadableName, FolderColumns.Slug]),
            Query.orderDesc(FolderColumns.UpdatedAt),
        ],
    });

    return result.rows;
}

export async function CreateFolder(folderName: string, userId: string) {
    return await tablesDb.createRow({
        rowId: ID.unique(),
        databaseId: DB.id,
        tableId: Table.Folders,
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
        databaseId: DB.id,
        tableId: Table.Folders,
        rowId: folderId,
        data: {
            "ReadableName": folderName,
        }
    })
}

export async function DeleteFolder(folderId: string) {
    const files = await GetFiles(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file[FileColumns.FileID])
    }

    await tablesDb.deleteRow({
        databaseId: DB.id,
        tableId: Table.Folders,
        rowId: folderId,
    })
}