import {isString} from './types';


export function assertElement<T extends HTMLElement>(element: T | null | undefined, elementName?: string): T {
    if (!element) {
        const message = elementName ? `element not found: ${elementName}` : 'element not found';
        throw new Error(message);
    }
    return element;
}


export function cssClasses(...classNames: unknown[]): string {
    return classNames
        .filter(isString)
        .map(className => `${className}`)
        .join(' ');
}


/**
 * In order to avoid mistakes like accidentally writing `&` instead of `&&` we
 * require an extra function call for bitwise operations.
 *
 * (the `no-bitwise` ESLint rule should be active for this to work)
 */
export function bitwiseAnd(v1: number, v2: number): number {
    // eslint-disable-next-line no-bitwise
    return v1 & v2;
}
