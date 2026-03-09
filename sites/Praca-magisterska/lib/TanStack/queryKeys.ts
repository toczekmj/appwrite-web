export const queryKeys = {
    folders: ['folders'],
    files: (folderId: string) => ['files', folderId],
    csvContent: (fileId: string) => ['csvContent', fileId],
}

