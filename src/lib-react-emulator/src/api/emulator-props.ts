import {TGameboyRomSource} from '@age-online/lib-core';
import {DisplayControls} from './display-controls';


export enum EmulatorState {
    NO_EMULATOR = 'no-emulator',
    EMULATOR_LOADING = 'emulator-loading',
    EMULATOR_READY = 'emulator-ready',
    EMULATOR_ERROR = 'emulator-error',
}


export interface IEmulatorProps {
    readonly hideEmulator: boolean;
    readonly displayControls: DisplayControls;
    readonly romSource: TGameboyRomSource | null;

    onDisplayControls?(displayControls: DisplayControls): void;

    onEmulatorState?(emulatorState: EmulatorState): void;

    onRomSource?(romSource: TGameboyRomSource | null): void;
}

