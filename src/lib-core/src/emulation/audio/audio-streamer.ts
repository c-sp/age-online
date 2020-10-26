export class AudioStreamer {

    private readonly audioCtx: AudioContext;
    private workletNode?: AudioWorkletNode;
    private vol = 0.3;

    constructor(ageAudioWorkletUrl: string) {
        // eslint-disable-next-line
        const audioCtx: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
        this.audioCtx = audioCtx;

        if (audioCtx.audioWorklet) {
            audioCtx.audioWorklet.addModule(ageAudioWorkletUrl).then(
                () => {
                    this.workletNode = new AudioWorkletNode(audioCtx, 'age-audio-streamer', {
                        numberOfInputs: 1,
                        numberOfOutputs: 1,
                        outputChannelCount: [2],
                    });

                    this.workletNode.connect(audioCtx.destination);
                    this.workletNode.port.postMessage({volume: this.vol});
                },
                err => console.error('audioWorklet.addModule() failure', err),
            );
        } else {
            // this should not happen anymore with audioworklet-polyfill
            console.log('audioWorklet not available');
        }
    }

    close(): void {
        this.audioCtx.close().then(
            () => {
                // no-op
            },
            err => {
                console.error('error closing audio context', err);
            },
        );
    }

    get sampleRate(): number {
        // according to http://blog.mecheye.net/2017/09/i-dont-know-who-the-web-audio-api-is-designed-for/
        // the sample rate can change when switching audio devices
        return this.audioCtx.sampleRate;
    }

    set volume(volume: number) {
        this.vol = volume;

        const {workletNode} = this;
        if (workletNode) {
            workletNode.port.postMessage({volume});
        }
    }

    stream(buffer: Int16Array): void {
        const {workletNode, audioCtx} = this;
        if (workletNode) {
            workletNode.port.postMessage({
                sampleRate: audioCtx.sampleRate,
                samples: buffer,
            });
            if (audioCtx.state !== 'running') {
                console.warn('AudioContext.state', audioCtx.state);
            }
        }
    }
}
