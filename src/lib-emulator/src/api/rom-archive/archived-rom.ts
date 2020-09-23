export interface IArchivedRomTitle {
    readonly romHash: string;
    readonly romCustomTitle: string | null;
    readonly romInternalTitle: string;
}

export const archivedRomPrimaryKey: keyof IArchivedRomTitle = 'romHash';
export const archivedRomCustomTitleKey: keyof IArchivedRomTitle = 'romCustomTitle';
export const archivedRomInternalTitleKey: keyof IArchivedRomTitle = 'romInternalTitle';


export interface IArchivedRom extends IArchivedRomTitle {
    readonly romData: Uint8Array;
    readonly ramData: Uint8Array | null;
}
