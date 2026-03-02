import { Files } from "@/Generated/appwrite/types";

export class FileCache
{
    private cache: Map<string, Files[]> = new Map();

    /**
     * 
     * @param folderId - The id of the folder to get the files for.
     * @returns The files for the given folder.
     */
    get(folderId: string): Files[] | null {
        return this.cache.get(folderId) ?? null;
    }

    /**
     * 
     * @param id - The id of the file to get.
     * @returns The file with the given id.
     */
    getSingleItem(id: string): Files | null {
        const folderId = this.cache.keys().find(
            (key) => this.cache.get(key)?.find((item) => item.$id === id) !== undefined
        );
        if (!folderId) return null;
        return this.cache.get(folderId)?.find((item) => item.$id === id) ?? null;
    }

    /**
     * 
     * @param item - The file to add.
     * @param updateCollisions - Whether to update the file if it already exists or skip it.
     */
    addSingleItem(item: Files, updateCollisions?: boolean): void {
        const folderId = this.getFolderKey(item);
        if (!folderId) return;

        const existingItem = this.getSingleItem(item.$id);
        if (existingItem && !updateCollisions) return;
        if (!this.cache.has(folderId))
            this.cache.set(folderId, []);
        
        this.cache.get(folderId)!.push(item);
    }

    /**
     * 
     * Folder id is determined by the first file in the array.
     * @param items - The files to add.
     * @param updateCollisions - Whether to update the files if they already exist or skip them.
     */
    add(items: Files[], updateCollisions?: boolean): void {
        if (items.length === 0) return;
        const folderId = this.getFolderKey(items[0]);
        if (!folderId) return;
        if (!this.cache.has(folderId))
            this.cache.set(folderId, []);
        for (const item of items) {
            this.addSingleItem(item, updateCollisions);
        }
    }
    
    update(id: string, data: Partial<Files>): void {
        const existingItem = this.getSingleItem(id);
        if (!existingItem) return;

        const folderKey = this.getFolderKey(existingItem);
        if (!folderKey) return;

        const arr = this.cache.get(folderKey);
        if (!arr) return;

        const index = arr.findIndex((f) => f.$id === id);
        if (index === -1) return;

        arr[index] = { ...existingItem, ...data };

        this.cache.set(folderKey, arr);
    }

    delete(id: string): void {
        const existingItem = this.getSingleItem(id);
        if (!existingItem) return;

        const folderKey = this.getFolderKey(existingItem);
        if (!folderKey) return;

        const arr = this.cache.get(folderKey);
        if (!arr) return;

        const index = arr.findIndex((f) => f.$id === id);
        if (index === -1) return;

        arr.splice(index, 1);

        this.cache.set(folderKey, arr);
    }

    invalidate(): void {
        this.cache.clear();
    }
    
    private getFolderKey(item: Files): string | null {
        if (!item.genre) {
            return null;
        }

        if (typeof item.genre === "string") {
            return item.genre;
        }

        if (typeof item.genre === "object" && "$id" in item.genre && typeof (item.genre as { $id: unknown }).$id === "string") {
            return (item.genre as { $id: string }).$id;
        }

        return null;
    }
}

const defaultFileCache: FileCache = new FileCache();

export { defaultFileCache };