import type { Genres } from "#/generated/appwrite/types";
import type { ICache } from "#/lib/cache/ICache";


class DefaultFolderCache implements ICache<"folders", Genres> {
	private cache: Genres[] | null = null;

	get(_key?: "folders" | undefined): Genres[] | null {
		return this.cache;
	}

	getSingleItem(id: string): Genres | null {
		return this.cache?.find((item) => item.$id === id) ?? null;
	}

	addSingleItem(item: Genres, _key?: "folders" | undefined, updateCollisions?: boolean): void {
		const existingItem = this.getSingleItem(item.$id);
		if (existingItem && !updateCollisions) return;
		if (!this.cache) this.cache = [];
		this.cache.push(item);
	}

	add(items: Genres[], key?: "folders" | undefined, updateCollisions?: boolean): void {
		if (!this.cache) this.cache = [];
		for (const item of items) {
			this.addSingleItem(item, key, updateCollisions);
		}
	}

	update(id: string, data: Partial<Genres>, _key?: "folders" | undefined): void {
		const index = this.cache?.findIndex((item) => item.$id === id);
		if (index !== undefined && index !== -1 && this.cache) {
			this.cache[index] = { ...this.cache[index], ...data };
		}
	}

	delete(id: string, _key?: "folders" | undefined): void {
		const index = this.cache?.findIndex((item) => item.$id === id);
		if (index !== undefined && index !== -1 && this.cache) {
			this.cache.splice(index, 1);
		}
	}

	invalidate(): void {
		this.cache = null;
	}
}

const defaultFolderCache = new DefaultFolderCache();
export { defaultFolderCache };
