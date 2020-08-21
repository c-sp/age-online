import {assertNever} from './types';


export function formatValue(value: unknown): string {
    const type = typeof value;
    switch (type) {

        case 'undefined':
            return 'undefined';

        case 'boolean':
            return value ? 'true' : 'false';

        case 'number':
            return `${value as number}`;

        case 'bigint':
            return `${value as bigint}n`;

        case 'string':
            return `"${value as string}"`;

        case 'object':
            return value === null ? 'null' : tryJson();

        case 'function':
            // eslint-disable-next-line @typescript-eslint/ban-types
            return `function:${(value as Function).name}`;

        case 'symbol':
            return (value as symbol).toString();

        default:
            return assertNever(type);
    }

    function tryJson(): string {
        try {
            return JSON.stringify(value, (_key, vAny) => {
                const val = vAny as unknown;
                if (val === value) {
                    return val;
                }
                // no recursive serialization
                return (typeof val === 'object') && (val !== null) ? '[object Object]' : val;
            });

        } catch (err) {
            return errorMessage(err);
        }
    }
}


export function errorMessage(error: unknown): string {
    if (error instanceof Error) {
        const {name, message, constructor} = error;
        const type = name || constructor.name;
        return message ? `${type}: ${message}` : type;
    }
    return (typeof error === 'string') ? error : `${formatValue(error)}`;
}
