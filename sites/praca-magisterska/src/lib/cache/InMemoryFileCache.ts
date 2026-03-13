import type { Files } from "#/generated/appwrite/types";
import type { ICache } from "./ICache";

/**
 * In-memory cache implementation for files.
 * @template TKey - The type of the key for the cache.
 * @template TItem - The type of the item in the cache.
 */
class DefaultFileCache implements ICache<string, Files> {
    private cache: Map<string, Files[]> = new Map(); // Map of folder id to files.

    /**
     * 
     * @param folderId - The id of the folder to get the files for.
     * @returns The files for the given folder.
     */
    get(folderId?: string): Files[] | null {
        if (!folderId) return Array.from(this.cache.values()).flat();
        return this.cache?.get(folderId) ?? null;
    }

    /**
     * 
     * @param id - The id of the file to get.
     * @returns The file with the given id.
     */
    getSingleItem(id: string): Files | null {
        const folderId = this.getKeyFromFileId(id);
        if (!folderId) return null;
        return this.cache?.get(folderId)?.find((item) => item.$id === id) ?? null;
    }

    /**
     * 
     * @param item - The file to add.
     * @param key - The key of the folder to add the file to.
     * @param updateCollisions - Whether to update the file if it already exists or skip it.
     * 
     * If the file is already in the cache, it will be overwritten if updateCollisions is true.
     * 
     * If the 'key' is provided, it is superior to the genre of the file and it will be used to determine the folder id.
     * 
     * If the 'key' is not provided, the genre of the file will be used to determine the folder id.
     */
    addSingleItem(item: Files, key?: string, updateCollisions?: boolean): void {
        const [success, folderId] = this.tryGetFolderId(item, key);
        if (!success) return;

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
     * @param key - The key of the folder to add the files to.
     * @param updateCollisions - Whether to update the files if they already exist or skip them.
     *
     * If the file is already in the cache, it will be overwritten if updateCollisions is true.
     * 
     * If the 'key' is provided, it is superior to the genre of the file and it will be used to determine the folder id.
     * 
     * If the 'key' is not provided, the genre of the file will be used to determine the folder id.
     */
    add(items: Files[], key?: string, updateCollisions?: boolean): void {
        if (items.length === 0) return;

        const [success, folderId] = this.tryGetFolderId(items[0], key);
        if (!success) return;

        if (!this.cache?.has(folderId))
            this.cache?.set(folderId, []);
        for (const item of items) {
            this.addSingleItem(item, folderId, updateCollisions);
        }
    }

    /**
     * 
     * @param id - The id of the file to update.
     * @param data - The data to update the file with.
     * @param key - The key of the folder to update the file in.
     * 
     * If the file is not in the cache, the function will return.
     * 
     * If the 'key' is provided, it is superior to the genre of the file and it will be used to determine the folder id.
     * 
     * If the 'key' is not provided, the genre of the file (if exists in partial data) will be used to determine the folder id.
     */
    update(id: string, data: Partial<Files>, key?: string): void {
        const existingItem = this.getSingleItem(id);
        if (!existingItem) return;

        const [success, folderId] = this.tryGetFolderId(existingItem, key);
        if (!success) return;

        const arr = this.cache.get(folderId);
        if (!arr) return;

        const index = arr.findIndex((f) => f.$id === id);
        if (index === -1) return;

        arr[index] = { ...existingItem, ...data };

        this.cache.set(folderId, arr);
    }

    delete(fileId: string, key?: string): void {
        const existingItem = this.getSingleItem(fileId);
        if (!existingItem) return;

        const [success, folderId] = this.tryGetFolderId(existingItem, key);
        if (!success) return;

        const arr = this.cache.get(folderId);
        if (!arr) return;

        const index = arr.findIndex((f) => f.$id === fileId);
        if (index === -1) return;

        arr.splice(index, 1);

        this.cache.set(folderId, arr);
    }

    invalidate(): void {
        this.cache.clear();
    }

    private getKeyFromFileId(id: string): string | undefined {
        return Array.from(this.cache.keys()).find((key) => this.cache.get(key)?.find((item) => item.$id === id) !== undefined);
    }

    private tryGetFolderId(item: Files, key?: string): [success: boolean, folderId: string] {
        let folderId: string | undefined = key;
        if (!key) {
            folderId = getKeyFromFile(item);
        }
        if (!folderId)
            return [false, ""];
        return [true, folderId];

        /**
         * @param item - The file to get the key for.
         * @returns The key of the file.
         *
         * If the file has no genre, the function will return undefined.
         */
        function getKeyFromFile(item: Files): string | undefined {
            if (!item.genre) {
                return undefined;
            }

            if (typeof item.genre === "string") {
                return item.genre;
            }

            if (typeof item.genre === "object" && "$id" in item.genre && typeof (item.genre as { $id: unknown }).$id === "string") {
                return (item.genre as { $id: string }).$id;
            }

            return undefined;
        }
    }
}

const defaultFileCache = new DefaultFileCache();
export {defaultFileCache};