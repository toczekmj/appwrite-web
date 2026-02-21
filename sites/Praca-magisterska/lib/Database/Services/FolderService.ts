import {createFileSlug} from "@/lib/slugify";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {GetFiles} from "@/lib/Database/Services/FileService";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import { databases, Genres } from "@/Generated/appwrite";
import { DATABASE } from "@/Generated/appwrite/constants";

const database = databases.use(DATABASE).use('genres');

export async function GetFolders(): Promise<Genres[]> {
    const response = await database.list({
        queries(q) {
            return [
                q.select(['ReadableName', 'Slug', "$id"]),
                q.orderDesc('$updatedAt')
            ]
        },
    })

    return response.rows;
}

export async function IsComputationOngoing(folderId: string): Promise<boolean> {
    const response = await database.list({
        queries(q) {
            return [
                q.select(['transformation_ongoing']),
                q.equal("$id", folderId),
                q.limit(1),
            ]
        },
    })
    
    const IsComputationOngoing = response.rows[0].transformation_ongoing;
    return IsComputationOngoing !== null && IsComputationOngoing !== undefined && IsComputationOngoing !== false;
}

export async function CreateFolder(folderName: string, userId: string): Promise<Genres> {
    const data = {
        "ReadableName": folderName,
        "Slug": createFileSlug(folderName, userId),
    };

    return await database.create(data, {
        permissions(permission, role) {
            return [
                permission.write(role.user(userId)),
                permission.read(role.user(userId)),
                permission.update(role.user(userId)),
                permission.delete(role.user(userId)),
            ]
        },
    })
}

export async function UpdateFolder(folderId: string, folderName: string): Promise<Genres> {
    const data = {
        "ReadableName": folderName,
    };

    return await database.update(folderId, data);
}

export async function DeleteFolder(folderId: string): Promise<void> {
    const files = await GetFiles(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file[FileColumns.FileID])
    }

    await database.delete(folderId);
}