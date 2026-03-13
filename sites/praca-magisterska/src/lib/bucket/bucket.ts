import { BUCKET } from "#/generated/appwrite/constants";
import { client, storage } from "#/lib/appwrite";
import { ID, Permission, Role } from "appwrite";


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
        bucketId: BUCKET,
        onProgress: onProgress,
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.delete(Role.user(userId)),
        ]
    });
}

export async function DeleteFileFromBucket(fileId: string) {
    await storage.deleteFile({
        bucketId: BUCKET,
        fileId: fileId,
    })
}

export async function GetFileMetadata(fileId: string) {
    // Returns storage file metadata (throws if not found)
    return await storage.getFile({
        bucketId: BUCKET,
        fileId: fileId,
    });
}

export function GetFileDownloadUrl(fileId: string): string {
    return storage.getFileDownload({
        bucketId: BUCKET,
        fileId: fileId,
    });
}

export function GetFileViewUrl(fileId: string): string {
    return storage.getFileView({
        bucketId: BUCKET,
        fileId: fileId,
    });
}

export async function GetFileContentAsText(fileId: string): Promise<string> {
    // Use the Appwrite client to perform the GET request so session auth is sent
    // (cookies + X-Fallback-Cookies for cross-origin). Plain fetch() often misses
    // X-Fallback-Cookies and returns 404 for private files.
    const viewUrl = GetFileViewUrl(fileId);
    try {
        const buffer = await client.call("GET", new URL(viewUrl), {}, {}, "arrayBuffer");
        return new TextDecoder().decode(buffer);
    } catch (viewError: any) {
        const downloadUrl = GetFileDownloadUrl(fileId);
        try {
            const buffer = await client.call("GET", new URL(downloadUrl), {}, {}, "arrayBuffer");
            return new TextDecoder().decode(buffer);
        } catch (downloadError: any) {
            const msg = viewError?.message || String(viewError);
            throw new Error(
                `Failed to fetch file content: ${msg}.`
            );
        }
    }
}

export async function GetCsvFileContent(fileId: string | null): Promise<{ freq: number; mag: number }[]> {
    if (!fileId)
        throw new Error("File ID is required to fetch CSV file content");

    const text = await GetFileContentAsText(fileId);
    const dict: { freq: number; mag: number }[] = text
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map((line) => {
            const [freqStr, magStr] = line.split(",").map((cell) => cell.trim());
            return { freq: parseFloat(freqStr) ?? 0, mag: parseFloat(magStr) ?? 0 };
        })
        .slice(0, 30_000);
    return dict;
}
