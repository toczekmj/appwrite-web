import { FileColumns } from "@/lib/Database/Enums/FileColumns";
import { DeleteFileFromBucket } from "@/lib/Bucket/bucket";
import { databases } from "@/Generated/appwrite/databases";
import { DATABASE } from "@/Generated/appwrite/constants";

const database = databases.use(DATABASE).use('files');

export async function GetFile(fileId: string) {
    const response = await database.list({
        queries:(q) => [q.equal("$id", fileId)]
    });

    if (response.rows.length > 1) {
        throw new Error("Error - there is more than 1 file with given id");
    }
    return response.rows[0];
}

export async function GetFiles(folderId: string) {
    const response = await database.list({
        queries: (q) => [q.equal('genre', folderId)]
    })    
    return response.rows;
}

export async function LinkFile(folderId: string, fileId: string, fileName: string, userId: string) {
    const data = {
        "FileId": fileId,
        "FileName": fileName,
        "genre": folderId,
    };
    
    const createdFile = await database.create(data, {
        permissions: (permission, role) => [
            permission.write(role.user(userId)),
            permission.read(role.user(userId)),
            permission.update(role.user(userId)),
            permission.delete(role.user(userId))
        ]
    })

    return createdFile;
}

export async function DeleteFile(fileId: string) {
    const file = await database.get(fileId);
    const hasCsvData = file.data_file_id;
    const hasFile = file.FileId;

    if (hasCsvData) {
        console.log("hasCsvData", hasCsvData);
        await DeleteFileFromBucket(file.data_file_id!)
    }
    
    if (hasFile) {
        console.log("hasFile", hasFile);
        await DeleteFileFromBucket(file[FileColumns.FileID])
    } 

    await database.delete(fileId);
}
