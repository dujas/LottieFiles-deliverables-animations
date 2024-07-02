type WriteOperation<T> = {
  key: string;
  value: T;
};

type ReadOperation<T> = Omit<WriteOperation<T>, "value">;

export default class BrowserStorage<T> {
  private static instance: BrowserStorage<unknown> | null = null;
  private readonly localStorage: Storage;

  private constructor() {
    this.localStorage = localStorage;
  }

  static getInstance<T>(): BrowserStorage<T> {
    if (!BrowserStorage.instance) {
      BrowserStorage.instance = new BrowserStorage<T>();
    }
    return BrowserStorage.instance as BrowserStorage<T>;
  }

  get(key: ReadOperation<T>["key"]): T | null {
    const storage = this.localStorage;
    const item = storage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  set({ key, value }: WriteOperation<T>): void {
    const storage = this.localStorage;
    const serializedValue = JSON.stringify(value);
    storage.setItem(key, serializedValue);
  }

  remove({ key }: ReadOperation<T>): void {
    const storage = this.localStorage;
    storage.removeItem(key);
  }
}
