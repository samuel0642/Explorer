import { Hash } from "crypto";
import { apiRoutes } from "../constants/api-routes";
import { HashMap } from "./ds";
import { urlToHttpOptions } from "url";

type CacheOptions = {
  staleTimeInMs: number;
  onCacheMiss: () => boolean;
  onCacheHit: () => boolean;
};

interface ICache<T> {
  addItem: (id: string, data: T, cacheOptions: CacheOptions) => void;
  getItem: (id: string) => T;
  clearCache: () => boolean;
  clearCacheItem: (id: string) => boolean;
  setStaleTime: (newStaleTime: number) => void;
}

interface ICacheEntry<T> {
  data: T;
  entryTimestampUTC: number;
}

class KeyValueCache<T> implements ICache<T> {
  private cache: HashMap<string, ICacheEntry<T>>;
  private options: CacheOptions;

  constructor(options: CacheOptions) {
    this.options = { ...options };
  }

  private hash(id: string): string {
    return id;
  }

  private shouldUpdateCache(hash: string): boolean {
    const cacheEntry = this.cache.get(hash);

    // Check if the cache entry exists
    if (!cacheEntry) {
      return false;
    }

    // Check if the cache entry is stale
    const elapsedTime = new Date().getTime() - cacheEntry.entryTimestampUTC;
    if (elapsedTime >= this.options.staleTimeInMs) {
      return false; // Stale, don't update
    }

    return true; // Not stale, update
  }

  private _clearCache(): void {
    this.cache.clear();
  }

  setStaleTime(newStaleTime: number) {
    this.options = { ...this.options, staleTimeInMs: newStaleTime };
  }

  private prepareCacheEntry(data: T): ICacheEntry<T> {
    const cacheEntry: ICacheEntry<T> = {
      entryTimestampUTC: new Date().getTime(),
      data,
    };

    return cacheEntry;
  }

  addItem(id: string, data: T): void {
    const hash = this.hash(id);

    if (this.shouldUpdateCache(hash)) {
      const cacheEntry = this.prepareCacheEntry(data);
      this.cache.set(hash, cacheEntry);
    }
  }

  getItem(id: string): T | undefined {
    const cacheEntry = this.cache.get(id);

    if (cacheEntry) {
      return cacheEntry.data;
    }

    return undefined;
  }

  clearCache(): boolean {
    try {
      this._clearCache();
      return true;
    } catch (error) {
      return false;
    }
  }

  clearCacheItem(id: string): boolean {
    try {
      const hash = this.hash(id);
      this.cache.delete(hash);
      return true;
    } catch (error) {
      return false;
    }
  }
}

const httpCache = new KeyValueCache<any>({ staleTimeInMs: 120000, onCacheMiss: () => { return true }, onCacheHit: () => { return true }})

const originalFetch = window.fetch;
const cacheableFetch = async (url: string, options: RequestInit, hashParams: Array<string>) => {
    const response = await originalFetch(url, options);
    if (url.includes('/search') && response.status === 200) {
        const id = btoa(hashParams.join("_")) 
        const data = await response.json()

        httpCache.addItem(id, data)
    }

    return response
}

export { cacheableFetch }
export default KeyValueCache;
