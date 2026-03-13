export const queryKeys = {
    folders: ['folders'],
    files: (folderId: string) => ['files', folderId],
    csv: (fileId: string) => ['csvContent', fileId],
}