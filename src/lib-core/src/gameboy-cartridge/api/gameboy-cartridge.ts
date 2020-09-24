export enum CartridgeCgbFunctions {
    NO_CGB = 'cgb functions not supported',
    CGB_SUPPORTED = 'cgb function supported',
    CGB_REQUIRED = 'cgb functions required',
}

export enum CartridgeMBC {
    ROM_ONLY = 'rom only',
    MBC1 = 'mbc1',
    MBC2 = 'mbc2',
    ROM_RAM = 'rom+ram',
    MMM01 = 'mmm01',
    MBC3 = 'mbc3',
    MBC5 = 'mbc5',
    MBC6 = 'mbc6',
    MBC7 = 'mbc7',
    POCKET_CAMERA = 'pocket camera',
    BANDAI_TAMA5 = 'bandai tama5',
    HUC3 = 'huc3',
    HUC1 = 'huc1',
}

export interface IGameboyCartridge {

    /**
     * The rom's title is read from `0x0134 - 0x0143`.
     * The title should be upper case ascii,
     * but we allow all ascii characters from `0x20` to `0x7E`.
     *
     * TODO handle 11, 15 and 16 character titles
     *
     * @see https://gbdev.io/pandocs/#_0134-0143-title
     */
    readonly romTitle: string;

    /**
     * The destination code ("Japanese flag") is read from `0x14A`.
     *
     * @see https://gbdev.io/pandocs/#_014a-destination-code
     */
    readonly japanese: boolean;

    /**
     * The CGB-functions flag is read from `0x143`.
     *
     * @see https://gbdev.io/pandocs/#_0143-cgb-flag
     */
    readonly cgbFunctions: CartridgeCgbFunctions;

    /**
     * The SGB-functions flag is read from `0x146`.
     *
     * @see https://gbdev.io/pandocs/#_0146-sgb-flag
     */
    readonly sgbFunctions: boolean;

    readonly headerChecksum: number;
    readonly headerChecksumComputed: number;

    /**
     * The Memory Bank Controller is derived from the cartridge type at `0x147`.
     *
     * @see https://gbdev.io/pandocs/#_0147-cartridge-type
     */
    readonly mbc: CartridgeMBC;

    /**
     * The number of 16 KB rom banks is specified by the value at `0x148`.
     *
     * @see https://gbdev.io/pandocs/#_0148-rom-size
     */
    readonly romBanks: number;
    readonly romBytes: number;

    /**
     * The ram size is derived from the value at `0x149`.
     *
     * @see https://gbdev.io/pandocs/#_0149-ram-size
     */
    readonly ramBytes: number;

    /**
     * If the cartridge has a battery it's ram should be saved somewhere.
     * (defined by the cartridge type at `0x147`)
     *
     * @see https://gbdev.io/pandocs/#_0147-cartridge-type
     */
    readonly ramIsPersistent: boolean;

    readonly romData: Uint8Array;
    readonly ramData?: Uint8Array;
}
