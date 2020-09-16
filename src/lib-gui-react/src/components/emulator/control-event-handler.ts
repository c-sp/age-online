import {MouseEvent, TouchEvent} from "react";


export interface IElementPoint {
    readonly elementX: number;
    readonly elementY: number;
}


export class ControlEventHandler {

    private mouseIsDown = false;

    constructor(private readonly insideElemTouches: (points: ReadonlyArray<IElementPoint>, elem: Element) => void) {
    }

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

    onTouch(ev: TouchEvent): void {
        // prevent mouse event emulation, see also
        // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
        ev.preventDefault();

        const {touches, currentTarget} = ev;

        const elemPoints = new Array<IElementPoint | null>();
        for (let i = 0; i < touches.length; ++i) {
            const {clientX, clientY} = touches[i];
            elemPoints.push(elemPoint(clientX, clientY, currentTarget.getBoundingClientRect()));
        }

        this.insideElemCallback(currentTarget, ...elemPoints);
    }


    onMouse(ev: MouseEvent): void {
        const {type, clientX, clientY, currentTarget} = ev;
        switch (type) {

            case 'mousedown':
                this.mouseIsDown = true;
                this.insideElemCallback(currentTarget, elemPoint(clientX, clientY, currentTarget.getBoundingClientRect()));
                break;

            case 'mousemove':
                if (this.mouseIsDown) {
                    this.insideElemCallback(currentTarget, elemPoint(clientX, clientY, currentTarget.getBoundingClientRect()));
                }
                break;

            case 'mouseleave': // TODO ugly, capture mouse events somehow?
                if (this.mouseIsDown) {
                    this.mouseIsDown = false;
                    this.insideElemTouches([], currentTarget);
                }
                break;

            case 'mouseup':
                this.mouseIsDown = false;
                this.insideElemTouches([], currentTarget);
                break;
        }
    }


    private insideElemCallback(elem: Element, ...elemPoints: (IElementPoint | null)[]): void {
        this.insideElemTouches(elemPoints.filter((v): v is IElementPoint => !!v), elem);
    }
}


function elemPoint(clientX: number, clientY: number, {left, top, width, height}: DOMRect): IElementPoint | null {
    const elementX = clientX - left;
    const elementY = clientY - top;

    if ((elementX < 0) || (elementY < 0)) {
        return null;
    }
    if ((elementX >= width) || (elementY >= height)) {
        return null;
    }

    return {elementX, elementY};
}
