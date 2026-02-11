import {storage} from "@/lib/appwrite";
import {ID, Permission, Role} from "appwrite";

const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;

export function CreateFileInBucket(
    file: File,
    userId: string,
    onProgress?: (progress: {
        $id: string,
        progress: number;
        sizeUploaded: number,
        chunksTotal: number;
        chunksUploaded: number
    }) => void
) {
    return storage.createFile({
            file: file,
        fileId: ID.unique(),
            bucketId: bucketId,
            onProgress: onProgress,
            permissions: [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        });
}

export async function DeleteFileFromBucket(fileId: string){
    await storage.deleteFile({
        bucketId: bucketId,
        fileId: fileId,
    })
}
