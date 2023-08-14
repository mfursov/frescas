import {describe, expect, it} from '@jest/globals';
import {AsyncFreshValueMap, FreshValueMap} from '../src';
import {sleep} from './TestUtils';

describe('FreshValueMap', () => {
    it('re-uses cached expirable values', async () => {
        let loadCallCount = 0;
        const map = new FreshValueMap<number, number>(() => ({
            refreshPeriodMillis: 0,
            load: (settings): number => {
                settings.refreshPeriodMillis = 50;
                loadCallCount++;
                return loadCallCount * 2;
            }
        }));
        expect(loadCallCount).toBe(0);

        const key = 12345;
        expect(map.get(key)).toBe(2);
        expect(loadCallCount).toBe(1);

        expect(map.get(key)).toBe(2);
        expect(loadCallCount).toBe(1);

        await sleep(51);
        expect(map.get(key)).toBe(4);
        expect(loadCallCount).toBe(2);

        expect(map.get(key)).toBe(4);
        expect(loadCallCount).toBe(2);
    });
});

describe('AsyncFreshValueMap', () => {
    it('re-uses cached expirable values', async () => {
        let loadCallCount = 0;
        const map = new AsyncFreshValueMap<number, number>(() => ({
            refreshPeriodMillis: 0,
            load: async (settings): Promise<number> => {
                settings.refreshPeriodMillis = 50;
                loadCallCount++;
                return loadCallCount * 2;
            }
        }));
        expect(loadCallCount).toBe(0);

        const key = 12345;
        expect(await map.get(key)).toBe(2);
        expect(loadCallCount).toBe(1);

        expect(await map.get(key)).toBe(2);
        expect(loadCallCount).toBe(1);

        await sleep(51);
        expect(await map.get(key)).toBe(4);
        expect(loadCallCount).toBe(2);

        expect(await map.get(key)).toBe(4);
        expect(loadCallCount).toBe(2);
    });
});
