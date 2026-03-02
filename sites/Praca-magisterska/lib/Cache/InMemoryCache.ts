import { Models } from "appwrite";
import { ICache } from "./ICache";

/**
 * In-memory cache implementation.
 * @template T - The type of the items in the cache - must extend {@link Models.Row}.
 */
export class InMemoryCache<T extends Models.Row> implements ICache<T> {
    private cache: T[] | null = null;

    get(): T[] | null {
        return this.cache;
    }

    getSingleItem(id: string): T | null {
        return this.cache?.find((item) => item.$id === id) ?? null;
    }

    addSingleItem(item: T, updateCollisions: boolean = false): void {
        const existingItem = this.getSingleItem(item.$id) ?? null;
        if (existingItem && !updateCollisions) return;
        if (!this.cache) this.cache = [];
        this.cache.push(item);
    }

    add(items: T[], updateCollisions: boolean): void {
        if (!this.cache) this.cache = [];
        for (const item of items) {
            this.addSingleItem(item, updateCollisions);
        }
    }

    update(id: string, data: Partial<T>): void {
        const index = this.cache?.findIndex((item) => item.$id === id);
        if (index !== undefined && index !== -1 && this.cache) {
            this.cache[index] = { ...this.cache[index], ...data };
        }
    }

    delete(id: string): void {
        const index = this.cache?.findIndex((item) => item.$id === id);
        if (index !== undefined && index !== -1 && this.cache) {
            this.cache.splice(index, 1);
        }
    }

    invalidate(): void {
        this.cache = null;
    }
}