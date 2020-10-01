export interface IArchivedRom {
    readonly romHashMD5: string;
    readonly romCustomTitle: string | null;
    readonly romInternalTitle: string;
    readonly addedOn: Date;
}

export interface IArchivedRomData {
    readonly romHashMD5: string;
    readonly romData: Uint8Array;
}

export interface IArchivedRamData {
    readonly romHashMD5: string;
    readonly ramData: Uint8Array;
}

/**
 * typesafe primary key:
 * the primary key exists in all interfaces
 */
export const archivedRomPrimaryKey: keyof IArchivedRom & keyof IArchivedRomData & keyof IArchivedRamData = 'romHashMD5';
