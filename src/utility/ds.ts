class HashMap<KT, VT> implements Map<KT, VT> {
    private map: { [key: string]: VT } = {};
  
    constructor() {}
  
    clear(): void {
      this.map = {};
    }
  
    delete(key: KT): boolean {
      const stringKey = String(key);
      const hasKey = stringKey in this.map;
      if (hasKey) {
        delete this.map[stringKey];
      }
      return hasKey;
    }
  
    forEach(
      callbackfn: (value: VT, key: KT, map: Map<KT, VT>) => void,
      thisArg?: any
    ): void {
      for (const key in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
          const typedKey = key as unknown as KT;
          callbackfn.call(thisArg, this.map[key], typedKey, this);
        }
      }
    }
  
    get(key: KT): VT | undefined {
      const stringKey = String(key);
      return this.map[stringKey];
    }
  
    has(key: KT): boolean {
      const stringKey = String(key);
      return stringKey in this.map;
    }
  
    set(key: KT, value: VT): this {
      const stringKey = String(key);
      this.map[stringKey] = value;
      return this;
    }
  
    get size(): number {
      return Object.keys(this.map).length;
    }
  
    entries(): IterableIterator<[KT, VT]> {
      const entries: [KT, VT][] = [];
      for (const key in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
          const typedKey = key as unknown as KT;
          entries.push([typedKey, this.map[key]]);
        }
      }
      return entries.values();
    }
  
    keys(): IterableIterator<KT> {
      const keys: KT[] = [];
      for (const key in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
          const typedKey = key as unknown as KT;
          keys.push(typedKey);
        }
      }
      return keys.values();
    }
  
    values(): IterableIterator<VT> {
      return Object.values(this.map).values();
    }
  
    [Symbol.iterator](): IterableIterator<[KT, VT]> {
      return this.entries();
    }
  
    [Symbol.toStringTag]: string = "HashMap";
  }

  export { HashMap }