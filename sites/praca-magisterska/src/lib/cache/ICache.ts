/**
 * Contract for generic cache. Services depend on this interface,
 * so the implementation can be swapped.
 */
export interface ICache<TKey, TItem> {
    /**
     * 
     * @param key - The key of the items to get.
     * @returns The item array with the given key.
     * 
     * If the key is not provided, the function will return all items.
     */
    get(key?: TKey): TItem[] | null;
    /**
     * 
     * @param id - The id of the item to get.
     * @returns The item with the given id.
     */
    getSingleItem(id: string): TItem | null;
    /**
     * 
     * @param item - The item to add to the cache.
     * @param updateCollisions - Whether to update the item if it already exists or skip it.
     */
    addSingleItem(item: TItem, key?: TKey, updateCollisions?: boolean): void;
    /**
     * 
     * @param items - The items to add to the cache.
     * @param updateCollisions - Whether to update the items if they already exist or skip them.
     */
    add(items: TItem[], key?: TKey, updateCollisions?: boolean): void;
    /**
     * 
     * @param id - The id of the item to update.
     * @param data - The data to update the item with.
     */
    update(id: string, data: Partial<TItem>, key?: TKey): void;
    /**
     * 
     * @param id - The id of the item to delete.
     */
    delete(id: string, key?: TKey): void;
    /**
     * Invalidates the cache.
     */
    invalidate(): void;
}