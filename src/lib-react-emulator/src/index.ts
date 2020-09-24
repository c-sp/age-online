import {EmulationFactory, IEmulationFactory, IRomArchive, newRomArchive} from '@age-online/lib-core';


export function createEmulationFactory(ageWasmJsUrl: string,
                                       ageWasmUrl: string): IEmulationFactory {

    return new EmulationFactory(ageWasmJsUrl, ageWasmUrl);
}


export function createRomArchive(archiveName: string): IRomArchive {
    return newRomArchive(archiveName);
}
