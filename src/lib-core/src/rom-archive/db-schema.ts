import {DBSchema} from 'idb';


/**
 * the current age-online database version
 */
export const DB_CURRENT_VERSION = 2;

export const DB_KEY_ROM_HASH = 'romHashMD5';

export interface IDbRomArchiveV2 extends DBSchema {

    /**
     * This store contains basic rom information (e.g. hash, name) to be used
     * for e.g. displaying a list of all archived roms.
     */
    'age-online-rom-info': {
        value: {
            romHashMD5: string;
            romCustomTitle?: string;
            romInternalTitle: string;
            addedOn: Date;
        };
        /**
         * `romHashMD5`
         */
        key: string;
    };

    /**
     * This store contains the actual rom binary data.
     */
    'age-online-rom-data': {
        value: {
            romHashMD5: string;
            romData: Uint8Array;
        };
        /**
         * `romHashMD5`
         */
        key: string;
    };

    /**
     * This store contains ram binary data
     * (used only for Gameboy cartridges with battery).
     */
    'age-online-ram-data': {
        value: {
            romHashMD5: string;
            ramData: Uint8Array;
        };
        /**
         * `romHashMD5`
         */
        key: string;
    };
}



export interface IDbRomArchiveV1 extends DBSchema {
    /**
     * This store was never really used and can be deleted.
     * No data was ever stored here.
     */
    'rom-archive': {
        key: string;
        value: unknown;
    };
}
