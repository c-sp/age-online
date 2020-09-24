export class Renderer {

    private readonly canvasCtx: CanvasRenderingContext2D;

    constructor(private readonly canvas: HTMLCanvasElement) {
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) {
            throw new Error('could not create canvas 2d rendering context');
        }
        this.canvasCtx = canvasCtx;
    }

    newFrame(frameData: Uint8ClampedArray): void {
        const imageData = new ImageData(frameData, 160, 144);

        const {canvas, canvasCtx} = this;
        if (canvas.width !== 160) {
            canvas.width = 160;
        }
        if (canvas.height !== 144) {
            canvas.height = 144;
        }

        canvasCtx.putImageData(imageData, 0, 0);
    }
}
