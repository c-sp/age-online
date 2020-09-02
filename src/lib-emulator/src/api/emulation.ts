export interface IEmulation {

    /**
     * Initialize emulation output:
     *  - prepare audio output
     *  - prepare video output for on the specified {@link HTMLCanvasElement}
     */
    initializeOutput(canvas: HTMLCanvasElement): void;

    /**
     * Run the emulation for the specified number of milliseconds.
     *
     * If {@link initializeOutput} has not been called yet,
     * the emulation will run but skip any output.
     */
    runEmulation(msToEmulate: number): void;

    // TODO buttonDown & buttonUp
}
