import {TGameboyRomSource} from '@age-online/lib-core';
import {DisplayControls} from './display-controls';
import {EmulatorState} from './emulator-state';


export interface IEmulatorProps {
    readonly hideEmulator: boolean;
    readonly ageWasmJsUrl: string;
    readonly ageWasmUrl: string;
    readonly displayControls: DisplayControls;
    readonly romSource: TGameboyRomSource | null;

    onDisplayControls?(displayControls: DisplayControls): void;

    onEmulatorState?(emulatorState: EmulatorState): void;

    onRomSource?(romSource: TGameboyRomSource | null): void;
}

