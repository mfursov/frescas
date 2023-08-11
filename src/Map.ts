import {AsyncFreshValue, AsyncFreshValueOptions, FreshValue, FreshValueOptions} from './Value';

/** Map of auto refreshable values. */
export class FreshValueMap<KeyType, ValueType> {
    protected readonly map = new Map<KeyType, FreshValue<ValueType>>();

    constructor(public readonly valueOptionsFactory: (key: KeyType) => FreshValueOptions<ValueType>) {}

    get(key: KeyType): ValueType {
        let value = this.map.get(key);
        if (value === undefined) {
            value = new FreshValue<ValueType>(this.valueOptionsFactory(key));
            this.map.set(key, value);
        }
        return value.get();
    }
}

/** Async version of the FreshValueMap. */
export class AsyncFreshValueMap<KeyType, ValueType> {
    protected readonly map = new Map<KeyType, AsyncFreshValue<ValueType>>();

    constructor(public readonly valueOptionsFactory: (key: KeyType) => AsyncFreshValueOptions<ValueType>) {}

    async get(key: KeyType): Promise<ValueType> {
        let value = this.map.get(key);
        if (value === undefined) {
            value = new AsyncFreshValue<ValueType>(this.valueOptionsFactory(key));
            this.map.set(key, value);
        }
        return await value.get();
    }
}
