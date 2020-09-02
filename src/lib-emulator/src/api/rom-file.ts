export interface ILocalRomFile {
    readonly localFile: File;
    readonly romFileUrl?: undefined;
}

export interface IRomFileUrl {
    readonly localFile?: undefined;
    readonly romFileUrl: string;
}

export type TRomFile = ILocalRomFile | IRomFileUrl;
