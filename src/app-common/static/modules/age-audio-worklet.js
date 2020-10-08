class Int16Buffer {

    constructor(minBufferSize) {
        this.buffers = [];
        this.bufferOffset = 0;
        this.bufferSize = 0;
        this.minBufferSize = minBufferSize;
        this.buffering = true;
        this.volume = 0.2;
    }

    setVolume(volume) {
        this.volume = Math.min(1, Math.max(0, volume));
    }

    addSamples(buffer) {
        // keep buffered data around the size of this._minBufferSize
        // (don't let the buffer grow too big)
        while (this.bufferSize > this.minBufferSize) {
            this.shiftBuffer();
        }

        // add new buffer
        this.buffers.push(buffer);
        this.bufferSize += buffer.length;

        // continue suspended audio output, if we have enough data now
        this.buffering = this.buffering && (this.bufferSize < this.minBufferSize);
    }

    writeAudioOutput(outputChannels) {
        if (this.buffering) {
            for (let c = 0; c < outputChannels.length; ++c) {
                for (let i = 0; i < outputChannels[c].length; ++i) {
                    outputChannels[c][i] = 0;
                }
            }

        } else {
            const outputLength = outputChannels[0].length;
            for (let outputIdx = 0; this.bufferSize && (outputIdx < outputLength);) {

                const samplesLeft = (this.buffers[0].length - this.bufferOffset) / 2;
                const samples = Math.min(samplesLeft, outputLength - outputIdx);
                const values = samples * 2; // 2 channels

                for (let i = this.bufferOffset, end = i + values; i < end; i += 2, ++outputIdx) {
                    outputChannels[0][outputIdx] = this.volume * this.buffers[0][i] / 32768;
                    outputChannels[1][outputIdx] = this.volume * this.buffers[0][i + 1] / 32768;
                }

                this.bufferOffset += values;
                this.bufferSize -= values;

                const diff = this.buffers[0].length - this.bufferOffset;
                if (diff < 2) {
                    this.shiftBuffer();
                }
            }

            // start buffering, if there are no samples left
            this.buffering = !this.bufferSize;
        }
    }

    shiftBuffer() {
        this.bufferSize -= this.buffers[0].length - this.bufferOffset;
        this.buffers.shift();
        this.bufferOffset = 0;
    }
}


const BUFFER_MILLIS = 50;

class AgeAudioStream extends AudioWorkletProcessor {

    constructor(options) {
        super(options);
        this.buffer = new Int16Buffer(1);
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        if (event.data.sampleRate && (event.data.sampleRate !== this.sampleRate)) {
            this.sampleRate = event.data.sampleRate;
            const bufferSize = this.sampleRate * BUFFER_MILLIS * 2 / 1000; // 2 channels
            this.buffer = new Int16Buffer(bufferSize);
        }

        if (event.data.samples) {
            this.buffer.addSamples(event.data.samples);
        }

        if (typeof event.data.volume === 'number') {
            this.buffer.setVolume(event.data.volume);
        }
    }

    /**
     * called once per render quantum (128 samples) according to spec
     */
    process(inputs, outputs) {
        this.buffer.writeAudioOutput(outputs[0]);
        return true;
    }
}

registerProcessor('age-audio-streamer', AgeAudioStream);
