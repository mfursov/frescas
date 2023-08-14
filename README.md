# frescas

Self-refreshable in-memory data cache.

- `FreshValue` and `AsyncFreshValue` - single refreshable value.
- `FreshValueMap` and `AsyncFreshValueMap` - maps of refreshable values.

### Usage example:

```typescript
/** Create a refreshable value. Define `load` function and use correct `refreshPeriodMillis` interval. */
const currentAccessToken = new AsyncFreshValue({
        refreshPeriodMillis: 0,
        load: async (settings) => {
            const response = await fetchAccessToken(/*....*/);
            settings.refreshPeriodMillis = Date.now() - response.expirationTime;
            return response.token;
        }
    });

// Use the fresh value :

async function getA(): A {
    const accessToken: string = await currentAccessToken.get();
    return fetch(accessToken, /** A-call params.*/);
}

async function getB(): B {
    const accessToken: string = await currentAccessToken.get();
    return fetch(accessToken, /** B-call params.*/);
}

```

### Docs & tests

Check in-code documentation and tests:

- [FreshValue](https://github.com/mfursov/frescas/tree/master/src/Value.ts) & [unit tests](https://github.com/mfursov/frescas/tree/master/tests/Value.jest.ts).
- [FreshValueMap](https://github.com/mfursov/frescas/tree/master/src/Map.ts) & [unit tests](https://github.com/mfursov/frescas/tree/master/tests/Map.jest.ts).
