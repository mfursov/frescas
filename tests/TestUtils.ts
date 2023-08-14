/** Waits `timeoutMillis` of milliseconds. */
export function sleep(timeoutMillis: number): Promise<void> {
    return new Promise(resolve => setTimeout(async () => resolve(), timeoutMillis));
}
