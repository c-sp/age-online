export function formatValue(value: unknown): string {
    switch (typeof value) {

        case 'undefined':
            return 'undefined';

        case 'boolean':
            return value ? 'true' : 'false';

        case 'number':
            return `${value}`;

        case 'bigint':
            return `${value}n`;

        case 'string':
            return `"${value}"`;

        case 'object':
            return value === null ? 'null' : tryJson();

        case 'function':
            return `function:${value.name}`;

        case 'symbol':
            return value.toString();
    }
    // We rely on TypeScript's switch exhaustiveness check:
    // in case of a missing switch-case, the TypeScript compiler should nag
    // about the function not returning any value here.

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
