import {ComponentType} from 'react';
import {IEmulatorProps} from './api';
import {Emulator} from './impl';

export * from './api';

export function emulatorComponent(): ComponentType<IEmulatorProps> {
    return Emulator;
}
