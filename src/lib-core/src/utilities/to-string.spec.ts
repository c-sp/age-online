import {errorMessage, formatValue} from './to-string';


describe('formatValue()', () => {

    // null & undefined

    it(...expectFormat(null, 'null'));
    it(...expectFormat(undefined, 'undefined'));

    // boolean

    it(...expectFormat(true, 'true'));
    it(...expectFormat(false, 'false'));

    // number

    it(...expectFormat(-123, '-123'));
    it(...expectFormat(0, '0'));
    it(...expectFormat(123, '123'));
    it(...expectFormat(NaN, 'NaN'));
    it(...expectFormat(Infinity, 'Infinity'));
    it(...expectFormat(-Infinity, '-Infinity'));

    // bigint (only with ES 2020)

    // it(...expectFormat(BigInt(-123), '-123n'));
    // it(...expectFormat(BigInt(0), '0n'));
    // it(...expectFormat(BigInt(123), '123n'));
    // cannot create BigInt from NaN, Infinity, -Infinity
    // it(...expectFormat(BigInt(NaN), 'NaN'));
    // it(...expectFormat(BigInt(Infinity), 'Infinity'));
    // it(...expectFormat(BigInt(-Infinity), '-Infinity'));

    // strings

    it(...expectFormat('', '""'));
    it(...expectFormat('abc', '"abc"'));
    it(...expectFormat('  abc  ', '"  abc  "'));

    // objects

    it(...expectFormat({}, '{}'));
    it(...expectFormat({foo: 123}, '{"foo":123}'));

    // functions

    it(...expectFormat(expectFormat, `function:${expectFormat.name}`));

    // symbols

    it(...expectFormat(Symbol('sym-foo'), 'Symbol(sym-foo)'));


    function expectFormat(value: unknown, expectedResult: string): [string, () => unknown] {
        let valueStr = JSON.stringify(value) ?? 'undefined';
        valueStr = valueStr.length < 50 ? valueStr : `${valueStr.substring(0, 47)}...`;
        return [
            `converts ${valueStr} (${typeof value}) to '${expectedResult}'`,
            (): unknown => expect(formatValue(value)).toBe(expectedResult),
        ];
    }
});


describe('errorMessage()', () => {

    it(...expectMessage('undefined', undefined));
    it(...expectMessage('null', null));
    it(...expectMessage('123', 123));
    it(...expectMessage('foo', 'foo'));

    it(...expectMessage('Error', new Error(), 'Error()'));
    it(...expectMessage('Error: foo', new Error('foo'), 'Error("foo")'));


    function expectMessage(expected: string, param: unknown, paramString?: string): [string, () => unknown] {
        const paramStr = paramString ?? formatValue(param);
        return [
            `returns "${expected}" for ${paramStr}`,
            (): unknown => expect(errorMessage(param)).toBe(expected),
        ];
    }
});
