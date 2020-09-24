import {ResizeObserver} from '@juggle/resize-observer';

// Until the Specification is finalized and has been adopted we use the
// ResizeObserver ponyfill to ensure the same behaviour across all browsers.
// See also: https://github.com/juggle/resize-observer#basic-usage


export interface IContentSize {
    readonly widthPx: number;
    readonly heightPx: number;
}


export function observeSize(element: HTMLElement,
                            onResize: (newSize: IContentSize) => void): () => void {

    const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length) {
            const [contentBoxSize] = entries[0].contentBoxSize;
            onResize({
                widthPx: contentBoxSize.inlineSize,
                heightPx: contentBoxSize.blockSize,
            });
        }
    });

    resizeObserver.observe(element);

    return (): void => resizeObserver.disconnect();
}
