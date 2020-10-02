import {errorMessage} from './to-string';


export class ErrorWithCause extends Error {

    // note that we don't overwrite ".stack", see also:
    // https://www.joyent.com/node-js/production/design/errors

    constructor(message?: string, readonly cause?: unknown) {
        super(message);
    }
}


export function errorInfo(error: unknown): string {
    const msg = errorMessage(error);
    const stack = error instanceof Error ? error.stack : undefined;

    // error.name and error.message may be included in error.stack on
    // some browsers (but not all browsers)
    const errStr = stack
        ? (stack.startsWith(msg) ? stack : `${msg}\n${stack}`)
        : msg;

    const cause = error instanceof ErrorWithCause ? error.cause : undefined;
    return cause ? `${errStr}\ncaused by:\n${errorInfo(cause)}` : errStr;
}
