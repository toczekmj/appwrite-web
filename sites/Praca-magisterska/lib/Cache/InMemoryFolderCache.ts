import { Genres } from "@/Generated/appwrite/types";
import { ICache } from "./ICache";
import { InMemoryCache } from "./InMemoryCache";

/**
 * Default folder cache implementation.
 */
const defaultFolderCache: ICache<Genres> = new InMemoryCache<Genres>();

export { defaultFolderCache };
