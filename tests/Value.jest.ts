import {describe, expect, it} from '@jest/globals';
import {AsyncFreshValue, FreshValue} from '../src';
import {sleep} from './TestUtils';

describe('FreshValue', () => {
    it('returns cached value and updates it when expired', async () => {
        let loadCallCount = 0;
        const value = new FreshValue<number>({
            refreshPeriodMillis: 0,
            load: (settings): number => {
                settings.refreshPeriodMillis = 50;
                loadCallCount++;
                return loadCallCount * 2;
            }
        });
        expect(loadCallCount).toBe(0);

        expect(value.get()).toBe(2);
        expect(loadCallCount).toBe(1);

        expect(value.get()).toBe(2);
        expect(loadCallCount).toBe(1);

        await sleep(51);
        expect(value.get()).toBe(4);
        expect(loadCallCount).toBe(2);

        expect(value.get()).toBe(4);
        expect(loadCallCount).toBe(2);
    });
});

describe('AsyncFreshValue', () => {
    it('returns cached value and updates it when expired', async () => {
        let loadCallCount = 0;
        const value = new AsyncFreshValue<number>({
            refreshPeriodMillis: 0,
            load: async (settings): Promise<number> => {
                settings.refreshPeriodMillis = 50;
                loadCallCount++;
                return loadCallCount * 2;
            }
        });
        expect(loadCallCount).toBe(0);

        expect(await value.get()).toBe(2);
        expect(loadCallCount).toBe(1);

        expect(await value.get()).toBe(2);
        expect(loadCallCount).toBe(1);

        await sleep(51);
        expect(await value.get()).toBe(4);
        expect(loadCallCount).toBe(2);

        expect(await value.get()).toBe(4);
        expect(loadCallCount).toBe(2);
    });
});
