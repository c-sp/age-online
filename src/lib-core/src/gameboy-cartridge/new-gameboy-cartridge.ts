import {bitwiseAnd, ErrorWithCause} from '../utilities';
import {CartridgeCgbFunctions, CartridgeMBC, IGameboyCartridge} from './api';
import {Md5} from 'ts-md5';


export class InvalidRomFileError extends ErrorWithCause {
}


const CART_MBC = 0x147;
const CART_ROM_SIZE = 0x148;
const CART_RAM_SIZE = 0x149;
const CART_HEADER_CHECKSUM = 0x14D;


export function newGameboyCartridge(romBuffer: ArrayBuffer, ignoreHeaderChecksum?: boolean): IGameboyCartridge {
    const romData = new Uint8Array(romBuffer);

    // validate rom data before calculating any hash

    const mbc = readRomMBC(romData);
    const romBanks = readRomBanks(romData);
    const ramBytes = readRamBytes(romData);

    const headerChecksum = romData[CART_HEADER_CHECKSUM];
    const headerChecksumComputed = computeHeaderChecksum(romData);

    if (!ignoreHeaderChecksum && (headerChecksum !== headerChecksumComputed)) {
        const reason = `header checksum mismatch: found ${headerChecksum}, expected ${headerChecksumComputed}`;
        throw new InvalidRomFileError(reason);
    }

    // Calculate the rom hash.
    //
    // The hashing library was chosen based on the performance results at:
    // https://brillout.com/test-javascript-hash-implementations/
    //
    // Since there don't seem to be any type declarations for YaMD5 we use
    // ts-md5 instead which is based on YaMD5.

    const romHashMD5 = new Md5()
        .start()
        .appendByteArray(romData)
        .end() as string;

    return {
        romTitle: readRomTitle(romData),
        japanese: readJapanese(romData),
        cgbFunctions: readCgbFunctions(romData),
        sgbFunctions: readSgbFunctions(romData),
        headerChecksum,
        headerChecksumComputed,
        mbc,
        romBanks,
        romBytes: romBanks * 16 * 1024,
        ramBytes,
        ramIsPersistent: hasBattery(romData),
        romHashMD5,
        romData,
    };
}


function readRomTitle(romData: Uint8Array): string {
    const codePoints = new Array<number>();
    for (let i = 0x134; i <= 0x143; ++i) {
        const codePoint = romData[i];
        codePoints.push((codePoint >= 0x20 && codePoint <= 0x7E) ? codePoint : 0x20);
    }
    return String.fromCodePoint(...codePoints).trim();
}


function readCgbFunctions(romData: Uint8Array): CartridgeCgbFunctions {
    switch (bitwiseAnd(romData[0x143], 0xC0)) {
        case 0x80:
            return CartridgeCgbFunctions.CGB_SUPPORTED;

        case 0xC0:
            return CartridgeCgbFunctions.CGB_REQUIRED;

        default:
            return CartridgeCgbFunctions.NO_CGB;
    }
}


function readSgbFunctions(romData: Uint8Array): boolean {
    return romData[0x146] === 0x03;
}


function readRomMBC(romData: Uint8Array): CartridgeMBC {
    switch (romData[CART_MBC]) {

        case 0x00:
            return CartridgeMBC.ROM_ONLY;

        case 0x01:
        case 0x02:
        case 0x03:
            return CartridgeMBC.MBC1;

        case 0x05:
        case 0x06:
            return CartridgeMBC.MBC2;

        case 0x08:
        case 0x09:
            return CartridgeMBC.ROM_RAM;

        case 0x0B:
        case 0x0C:
        case 0x0D:
            return CartridgeMBC.MMM01;

        case 0x0F:
        case 0x10:
        case 0x11:
        case 0x12:
        case 0x13:
            return CartridgeMBC.MBC3;

        case 0x19:
        case 0x1A:
        case 0x1B:
        case 0x1C:
        case 0x1D:
        case 0x1E:
            return CartridgeMBC.MBC5;

        case 0x20:
            return CartridgeMBC.MBC6;

        case 0x22:
            return CartridgeMBC.MBC7;

        case 0xFC:
            return CartridgeMBC.POCKET_CAMERA;

        case 0xFD:
            return CartridgeMBC.BANDAI_TAMA5;

        case 0xFE:
            return CartridgeMBC.HUC3;

        case 0xFF:
            return CartridgeMBC.HUC1;

        default:
            throw new InvalidRomFileError(`unsupported MBC type: ${romData[CART_MBC]}`);
    }
}

function hasBattery(romData: Uint8Array): boolean {
    return [
        0x03, // MBC1+RAM+BATTERY
        0x06, // MBC2+BATTERY
        0x09, // ROM+RAM+BATTERY
        0x0D, // MMM01+RAM+BATTERY
        0x0F, // MBC3+TIMER+BATTERY
        0x10, // MBC3+TIMER+RAM+BATTERY
        0x13, // MBC3+RAM+BATTERY
        0x1B, // MBC5+RAM+BATTERY
        0x1E, // MBC5+RUMBLE+RAM+BATTERY
        0x22, // MBC7+SENSOR+RUMBLE+RAM+BATTERY
        0xFF, // HuC1+RAM+BATTERY
    ].includes(romData[CART_MBC]);
}


function readRomBanks(romData: Uint8Array): number {
    switch (romData[CART_ROM_SIZE]) {

        case 0x00:
            return 2;

        case 0x01:
            return 4;

        case 0x02:
            return 8;

        case 0x03:
            return 16;

        case 0x04:
            return 32;

        case 0x05:
            return 64;

        case 0x06:
            return 128;

        case 0x07:
            return 256;

        case 0x08:
            return 512;

        case 0x52:
            return 72;

        case 0x53:
            return 80;

        case 0x54:
            return 96;

        default:
            throw new InvalidRomFileError(`unsupported rom size: ${romData[CART_ROM_SIZE]}`);
    }
}


function readRamBytes(romData: Uint8Array): number {
    switch (romData[CART_RAM_SIZE]) {

        case 0x00:
            return 0;

        case 0x01:
            return 2 * 1024;

        case 0x02:
            return 8 * 1024;

        case 0x03:
            return 4 * 8 * 1024;

        case 0x04:
            return 16 * 8 * 1024;

        case 0x05:
            return 8 * 8 * 1024;

        default:
            throw new InvalidRomFileError(`unsupported ram size: ${romData[CART_RAM_SIZE]}`);
    }
}


function readJapanese(romData: Uint8Array): boolean {
    return romData[0x14A] === 0x00;
}


function computeHeaderChecksum(romData: Uint8Array): number {
    return bitwiseAnd(
        romData
            .slice(0x134, CART_HEADER_CHECKSUM) // 0x134 - 0x14C (including)
            .reduce(
                (checksum, byte) => checksum - byte - 1,
                0, // don't use the first byte as initial value
            ),
        0xFF,
    );
}
