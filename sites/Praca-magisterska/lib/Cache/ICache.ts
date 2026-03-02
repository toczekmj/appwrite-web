/**
 * Contract for generic cache. Services depend on this interface,
 * so the implementation can be swapped.
 */
export interface ICache<T> {
    get(): T[] | null;
    /**
     * 
     * @param id - The id of the item to get.
     * @returns The item with the given id.
     */
    getSingleItem(id: string): T | null;
    /**
     * 
     * @param item - The item to add to the cache.
     * @param updateCollisions - Whether to update the item if it already exists or skip it.
     */
    addSingleItem(item: T, updateCollisions?: boolean): void;
    /**
     * 
     * @param items - The items to add to the cache.
     * @param updateCollisions - Whether to update the items if they already exist or skip them.
     */
    add(items: T[], updateCollisions?: boolean): void;
    /**
     * 
     * @param id - The id of the item to update.
     * @param data - The data to update the item with.
     */
    update(id: string, data: Partial<T>): void;
    /**
     * 
     * @param id - The id of the item to delete.
     */
    delete(id: string): void;
    /**
     * Invalidates the cache.
     */
    invalidate(): void;
}