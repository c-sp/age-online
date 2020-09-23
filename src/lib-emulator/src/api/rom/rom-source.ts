import {ErrorWithCause} from '@age-online/lib-common';


export interface IGameboyRomFile {
    readonly localFile: File;
    readonly romFileUrl?: undefined;
}

export interface IGameboyRomUrl {
    readonly localFile?: undefined;
    readonly romFileUrl: string;
}

export type TGameboyRomSource = IGameboyRomFile | IGameboyRomUrl;


export class RomFileLoadingError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('rom file loading error', cause);
    }
}

export class NoZippedRomFoundError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('no rom file found in zip archive', cause);
    }
}

export class InvalidRomFileError extends ErrorWithCause {
}
