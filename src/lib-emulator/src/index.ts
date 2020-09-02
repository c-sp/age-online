import {IEmulationFactory} from './api';
import {EmulationFactory} from './impl';

export * from './api';


export function newEmulationFactory(ageWasmJsUrl: string,
                                    ageWasmUrl: string): IEmulationFactory {

    return new EmulationFactory(ageWasmJsUrl, ageWasmUrl);
}
