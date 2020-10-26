/**
 * This is a wrapper for fail-safe `localStorage` access.
 * It "handles" possible exceptions by letting reads return `null` and ignoring
 * failed writes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
 */
export class LocalStorage {

    private readonly store: Storage | null;

    constructor(private readonly globalPrefix: string) {
        try {
            // not available for SSR
            this.store = typeof localStorage === 'undefined' ? null : localStorage;

        } catch (err) {
            // possible SecurityError:
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
            this.store = null;
        }
    }


    getItem(key: string): string | null {
        const value = this.store?.getItem(`${this.globalPrefix}/${key}`);
        return value ?? null;
    }

    setItem(key: string, value: string): void {
        try {
            const {store} = this;
            if (store) {
                store.setItem(`${this.globalPrefix}/${key}`, value);
            }

        } catch (err) {
            // possible exception:
            // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
        }
    }
}
