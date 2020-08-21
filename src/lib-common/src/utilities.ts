/**
 * properties to be used for external links
 */
export const EXTERNAL_LINK_PROPS = {
    target: '_blank',
    rel: 'noopener noreferrer',
};


export function assertElement<T extends HTMLElement>(element: T | null | undefined, elementName?: string): T {
    if (!element) {
        const message = elementName ? `element not found: ${elementName}` : 'element not found';
        throw new Error(message);
    }
    return element;
}
