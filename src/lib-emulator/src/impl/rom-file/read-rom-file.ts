import {Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {
    IGameboyRom,
    InvalidRomFileError,
    RomCgbFunctions,
    RomFileLoadingError,
    RomMBC,
    TGameboyRomSource,
} from '../../api';
import {readBlob$} from './read-blob';
import {readUrl$} from './read-url';
import {extractRomFromZip$} from './read-zip';
import {bitwiseAnd} from '@age-online/lib-common';


const CART_MBC = 0x147;
const CART_ROM_SIZE = 0x148;
const CART_RAM_SIZE = 0x149;
const CART_HEADER_CHECKSUM = 0x14D;


export function readRomFile$(romFile: TGameboyRomSource): Observable<IGameboyRom> {
    const readFile$ = romFile.localFile
        ? readBlob$(romFile.localFile)
        : readUrl$(romFile.romFileUrl);

    return readFile$.pipe(
        // wrap any file reading error into a RomFileLoadingError
        catchError(err => {
            throw new RomFileLoadingError(err);
        }),

        // check if this is a zip archive and (if yes) try to extract any
        // Gameboy rom file from it
        switchMap(file => extractRomFromZip$(file)),

        // check the rom file
        map(checkGameboyRom),
    );
}


function checkGameboyRom(romFile: ArrayBuffer): IGameboyRom {
    const romData = new Uint8Array(romFile);
    const romBanks = readRomBanks(romData);

    const headerChecksum = romData[CART_HEADER_CHECKSUM];
    const headerChecksumComputed = computeHeaderChecksum(romData);

    if (headerChecksum !== headerChecksumComputed) {
        const reason = `header checksum mismatch: found ${headerChecksum}, expected ${headerChecksumComputed}`;
        throw new InvalidRomFileError(reason);
    }

    return {
        romTitle: readRomTitle(romData),
        japanese: readJapanese(romData),
        cgbFunctions: readCgbFunctions(romData),
        sgbFunctions: readSgbFunctions(romData),
        headerChecksum,
        headerChecksumComputed,
        mbc: readRomMBC(romData),
        romBanks,
        romBytes: romBanks * 16 * 1024,
        ramBytes: readRamBytes(romData),
        ramIsPersistent: hasBattery(romData),
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


function readCgbFunctions(romData: Uint8Array): RomCgbFunctions {
    switch (bitwiseAnd(romData[0x143], 0xC0)) {
        case 0x80:
            return RomCgbFunctions.CGB_SUPPORTED;

        case 0xC0:
            return RomCgbFunctions.CGB_REQUIRED;

        default:
            return RomCgbFunctions.NO_CGB;
    }
}


function readSgbFunctions(romData: Uint8Array): boolean {
    return romData[0x146] === 0x03;
}


function readRomMBC(romData: Uint8Array): RomMBC {
    switch (romData[CART_MBC]) {

        case 0x00:
            return RomMBC.ROM_ONLY;

        case 0x01:
        case 0x02:
        case 0x03:
            return RomMBC.MBC1;

        case 0x05:
        case 0x06:
            return RomMBC.MBC2;

        case 0x08:
        case 0x09:
            return RomMBC.ROM_RAM;

        case 0x0B:
        case 0x0C:
        case 0x0D:
            return RomMBC.MMM01;

        case 0x0F:
        case 0x10:
        case 0x11:
        case 0x12:
        case 0x13:
            return RomMBC.MBC3;

        case 0x19:
        case 0x1A:
        case 0x1B:
        case 0x1C:
        case 0x1D:
        case 0x1E:
            return RomMBC.MBC5;

        case 0x20:
            return RomMBC.MBC6;

        case 0x22:
            return RomMBC.MBC7;

        case 0xFC:
            return RomMBC.POCKET_CAMERA;

        case 0xFD:
            return RomMBC.BANDAI_TAMA5;

        case 0xFE:
            return RomMBC.HUC3;

        case 0xFF:
            return RomMBC.HUC1;

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
