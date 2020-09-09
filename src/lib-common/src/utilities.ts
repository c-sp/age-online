export function assertElement<T extends HTMLElement>(element: T | null | undefined, elementName?: string): T {
    if (!element) {
        const message = elementName ? `element not found: ${elementName}` : 'element not found';
        throw new Error(message);
    }
    return element;
}


export function cssClasses(...classNames: unknown[]): string {
    return classNames
        .filter(className => !!className)
        .map(className => `${className}`)
        .join(' ');
}
