import {createFileSlug} from "@/lib/slugify";
import {FileColumns} from "@/lib/Database/Enums/FileColumns";
import {GetFiles} from "@/lib/Database/Services/FileService";
import {DeleteFileFromBucket} from "@/lib/Bucket/bucket";
import { databases, Genres } from "@/Generated/appwrite";
import { DATABASE } from "@/Generated/appwrite/constants";
import { defaultFolderCache } from "@/lib/Cache/InMemoryFolderCache";
import { ICache } from "@/lib/Cache/ICache";

const database = databases.use(DATABASE).use('genres');

export async function GetFolders(folderCache: ICache<Genres> = defaultFolderCache): Promise<Genres[]> {
    const cachedFolders = folderCache.get();
    if (cachedFolders) {
        return cachedFolders;
    }

    const response = await database.list({
        queries(q) {
            return [
                q.select(['ReadableName', 'Slug', "$id"]),
                q.orderDesc('$updatedAt')
            ]
        },
    })

    folderCache.add(response.rows);
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

export async function CreateFolder(
    folderName: string,
    userId: string,
    folderCache: ICache<Genres> = defaultFolderCache
): Promise<Genres> {
    const data = {
        "ReadableName": folderName,
        "Slug": createFileSlug(folderName, userId),
    };

    const result = await database.create(data, {
        permissions(permission, role) {
            return [
                permission.write(role.user(userId)),
                permission.read(role.user(userId)),
                permission.update(role.user(userId)),
                permission.delete(role.user(userId)),
            ]
        },
    })

    folderCache.addSingleItem(result);

    return result;
}

export async function UpdateFolder(
    folderId: string,
    folderName: string,
    folderCache: ICache<Genres> = defaultFolderCache
): Promise<Genres> {
    const data = {
        "ReadableName": folderName,
    };

    const result = await database.update(folderId, data);
    folderCache.update(folderId, result);
    return result;
}

export async function DeleteFolder(
    folderId: string,
    folderCache: ICache<Genres> = defaultFolderCache
): Promise<void> {
    const files = await GetFiles(folderId);

    for (const file of files) {
        await DeleteFileFromBucket(file[FileColumns.FileID])
    }

    await database.delete(folderId);
    folderCache.delete(folderId);
}