/** FreshValue options and value provider. */
export interface FreshValueOptions<ValueType = unknown> {
    /** Indicates how often to refresh the value. */
    refreshPeriodMillis: number;
    /**
     * Returns a refreshed value. Called on every time `get()` method is called for an expired value.
     * The implementation is allowed to mutate `settings` argument fields.
     */
    load: (settings: FreshValueOptions<ValueType>) => ValueType;
}

export class FreshValueBase<ValueType> {
    protected value?: ValueType;
    protected nextRefreshTimeMillis = 0;

    clear(): void {
        this.value = undefined;
    }
}

/** Holds a value that refreshes every time the `get()` method is called and the value is expired or is never fetched. */
export class FreshValue<ValueType> extends FreshValueBase<ValueType> {
    constructor(public readonly options: FreshValueOptions<ValueType>) {super();}

    /** Returns a fresh value. Loads or refreshes it using `options.load` method if needed. */
    get(): ValueType {
        if (this.value !== undefined && this.nextRefreshTimeMillis > Date.now()) {
            return this.value;
        }
        this.value = this.options.load(this.options);

        this.nextRefreshTimeMillis = Date.now() + this.options.refreshPeriodMillis;
        return this.value;
    }
}

/** Async version of FreshValueOptions. */
export interface AsyncFreshValueOptions<ValueType = unknown> {
    /** Indicates how often to refresh the value. */
    refreshPeriodMillis: number;
    /**
     * Returns a refreshed value. Called on every time `get()` method is called for an expired value.
     * The implementation is allowed to mutate `settings` argument fields.
     */
    load: (options: AsyncFreshValueOptions<ValueType>) => Promise<ValueType>;
}

/** Async version of FreshValue. */
export class AsyncFreshValue<ValueType> extends FreshValueBase<ValueType> {
    constructor(public readonly options: AsyncFreshValueOptions<ValueType>) {super();}

    /** Returns a fresh value. Loads or refreshes it using `options.load` method if needed. */
    async get(): Promise<ValueType> {
        if (this.value !== undefined && this.nextRefreshTimeMillis > Date.now()) {
            return this.value;
        }
        this.value = await this.options.load(this.options);
        this.nextRefreshTimeMillis = Date.now() + this.options.refreshPeriodMillis;
        return this.value;
    }
}
