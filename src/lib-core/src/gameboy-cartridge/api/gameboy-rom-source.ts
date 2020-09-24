export interface IGameboyRomFile {
    readonly localFile: File;
    readonly romFileUrl?: undefined;
}

export interface IGameboyRomUrl {
    readonly localFile?: undefined;
    readonly romFileUrl: string;
}

export type TGameboyRomSource = IGameboyRomFile | IGameboyRomUrl;
