export interface ITouchPoint {
    readonly clientX: number;
    readonly clientY: number;
}


export function elementTouched(element: HTMLElement,
                               touchPoints: ReadonlyArray<ITouchPoint>): boolean {

    const {top, left, width, height} = element.getBoundingClientRect();

    return touchPoints.some(({clientX, clientY}) => {
        const elemX = clientX - left;
        const elemY = clientY - top;
        return (elemX >= 0) && (elemY >= 0) && (elemX < width) && (elemY < height);
    });
}


export class TouchEventHandler {

    // -----------------------
    // Which events do we use?
    // -----------------------
    //
    // Pointer Events (tl,dr: NO!)
    //
    // Using "onPointerDown", "onPointerMove" and "onPointerUp" with
    // optional setPointerCapture on "onPointerDown"
    // (for convenience only, capture does not change "pointer cancel"
    // behaviour)
    //  => "pointer cancel" after some seconds for mobile devices in
    //     chrome dev tools
    //  => no "up" event received after "pointer cancel"
    //
    //
    // Touch events (tl,dr: YES!)
    //
    // Using "onTouchStart", "onTouchMove" and "onTouchEnd" works exactly as we
    // need it with Chromes dev tools:
    //  - "onTouchEnd" is delivered after "onTouchStart" even if it did not
    //    occur inside the canvas
    //  - there is no "auto release" as with pointer events
    //    => "onTouchMove" is not time limited
    //  - use preventDefault() to prevent mouse event emulation on some devices
    //
    //
    // Mouse events (tl,dr: YES!)
    //
    //  - "mouseup" is not delivered when the cursor leaves the canvas while
    //    a mouse button is down
    //

    private mouseIsDown = false;

    private readonly touchListener = (ev: TouchEvent) => this.onTouchEvent(ev);
    private readonly mouseListener = (ev: MouseEvent) => this.onMouseEvent(ev);

    constructor(private readonly element: HTMLElement,
                private readonly touchPointsCallback: (points: ReadonlyArray<ITouchPoint>) => void) {

        element.addEventListener('touchstart', this.touchListener);
        element.addEventListener('touchmove', this.touchListener);
        element.addEventListener('touchend', this.touchListener);
        element.addEventListener('touchcancel', this.touchListener);

        element.addEventListener('mousedown', this.mouseListener);
        element.addEventListener('mousemove', this.mouseListener);
        element.addEventListener('mouseleave', this.mouseListener);
        element.addEventListener('mouseup', this.mouseListener);
    }

    removeListeners(): void {
        const {element} = this;

        element.removeEventListener('touchstart', this.touchListener);
        element.removeEventListener('touchmove', this.touchListener);
        element.removeEventListener('touchend', this.touchListener);
        element.removeEventListener('touchcancel', this.touchListener);

        element.removeEventListener('mousedown', this.mouseListener);
        element.removeEventListener('mousemove', this.mouseListener);
        element.removeEventListener('mouseleave', this.mouseListener);
        element.removeEventListener('mouseup', this.mouseListener);
    }


    private onTouchEvent(ev: TouchEvent): void {
        // prevent mouse event emulation on mobile devices, see also
        // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
        ev.preventDefault();

        const {touches} = ev;
        const {touchPointsCallback} = this;

        const elemPoints = new Array<ITouchPoint>();
        for (let i = 0; i < touches.length; ++i) {
            const {clientX, clientY} = touches[i];
            elemPoints.push({clientX, clientY});
        }

        touchPointsCallback(elemPoints);
    }

    private onMouseEvent(ev: MouseEvent): void {
        const {type, clientX, clientY} = ev;
        const {mouseIsDown, touchPointsCallback} = this;
        switch (type) {

            case 'mousedown':
                this.mouseIsDown = true;
                touchPointsCallback([{clientX, clientY}]);
                break;

            case 'mousemove':
                if (mouseIsDown) {
                    touchPointsCallback([{clientX, clientY}]);
                }
                break;

            case 'mouseleave': // TODO ugly, capture mouse events somehow?
                if (mouseIsDown) {
                    this.mouseIsDown = false;
                    touchPointsCallback([]);
                }
                break;

            case 'mouseup':
                if (mouseIsDown) {
                    this.mouseIsDown = false;
                    touchPointsCallback([]);
                }
                break;
        }
    }
}
