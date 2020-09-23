import {IEmulationFactory, IRomArchive} from './api';
import {EmulationFactory, RomArchive} from './impl';

export * from './api';


export function newEmulationFactory(ageWasmJsUrl: string,
                                    ageWasmUrl: string): IEmulationFactory {

    return new EmulationFactory(ageWasmJsUrl, ageWasmUrl);
}


export function newRomArchive(archiveName: string): IRomArchive {
    return new RomArchive(archiveName);
}
