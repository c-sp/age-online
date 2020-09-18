import {assertElement, cssClasses, IContentSize, observeSize} from '@age-online/lib-common';
import {IEmulation} from '@age-online/lib-emulator';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {CSSProperties, ReactNode} from 'react';
import {overlayBackgroundColor, TidyComponent} from '../common';
import {DisplayControls} from './display-controls';
import {EmulatorButtonControls} from './emulator-button-controls';
import {EmulatorCrossControls} from './emulator-cross-controls';
import {gameboyButton, IButtonsDown, noButtonsDown} from './buttons-down';
import {KeyboardEventHandler} from './keyboard-event-handler';


const styles = (theme: Theme) => createStyles({
    container: {
        position: 'relative',
        height: '100%',
        pointerEvents: 'none',
        display: 'grid',
    },
    landscape: {
        gridTemplateColumns: 'auto 1fr auto',
        gridTemplateAreas: '"left-controls screen right-controls"',
    },
    portrait: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr auto',
        gridTemplateAreas: '"screen screen" "left-controls right-controls"',
    },

    screen: {
        position: 'relative',
        gridArea: 'screen',
    },
    canvas: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    controls: {
        alignSelf: 'end',
        padding: theme.spacing(1),
        pointerEvents: 'auto',
        backgroundColor: overlayBackgroundColor(theme),
        opacity: 0.8,
    },

    controlsLeft: {
        borderTopRightRadius: theme.spacing(2),
    },
    controlsRight: {
        borderTopLeftRadius: theme.spacing(2),
    },

    controlsLeftGrid: {
        gridArea: 'left-controls',
        justifySelf: 'start',
    },
    controlsRightGrid: {
        gridArea: 'right-controls',
        justifySelf: 'end',
    },

    controlsLeftOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    controlsRightOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});


export interface IEmulatorProps {
    readonly emulation: IEmulation;
    readonly pauseEmulation: boolean;
    readonly displayControls: DisplayControls;
}

interface IEmulatorState extends IButtonsDown {
    readonly portrait: boolean;
    readonly canvasSize: IContentSize;
}

type TEmulatorProps = IEmulatorProps & WithStyles;

class ComposedEmulator extends TidyComponent<TEmulatorProps, IEmulatorState> {

    private containerDiv: HTMLDivElement | null = null;
    private screenDiv: HTMLDivElement | null = null;
    private canvas: HTMLCanvasElement | null = null;

    private readonly touchButtons = noButtonsDown();
    private readonly keyboardButtons = noButtonsDown();
    private keyboardEventHandler?: KeyboardEventHandler;

    constructor(props: TEmulatorProps) {
        super(props);
        this.state = {
            ...noButtonsDown(),
            portrait: true,
            canvasSize: {widthPx: 1, heightPx: 1},
        };
    }


    componentDidMount(): void {
        const {containerDiv, screenDiv, keyboardButtons, props: {emulation, pauseEmulation}} = this;

        this.initEmulation();
        emulation.pauseEmulation = pauseEmulation;

        this.keyboardEventHandler = new KeyboardEventHandler(
            button => this.buttonDown(button, keyboardButtons),
            button => this.buttonUp(button, keyboardButtons),
        );

        this.callOnUnmount(
            observeSize(
                assertElement(containerDiv, 'emulator container <div>'),
                ({widthPx, heightPx}) => {
                    const aspectRatio = (heightPx === 0) ? 0 : widthPx / heightPx;
                    const portrait = aspectRatio <= (160 / 144);
                    this.setState({portrait});
                },
            ),
            observeSize(
                assertElement(screenDiv, 'emulator screen <div>'),
                ({widthPx, heightPx}) => {
                    const canvasSize: IEmulatorState['canvasSize'] =
                        (widthPx / heightPx > 160 / 144)
                            // margin left & right
                            ? {widthPx: Math.floor(heightPx * 160 / 144), heightPx}
                            // margin top & bottom
                            : {widthPx, heightPx: Math.floor(widthPx * 144 / 160)};

                    if ((canvasSize.widthPx === this.state.canvasSize.widthPx)
                        && (canvasSize.heightPx === this.state.canvasSize.heightPx)) {
                        return;
                    }
                    this.setState({canvasSize});
                },
            ),
            () => this.props.emulation.stopEmulation(),
            () => this.keyboardEventHandler?.removeEventListeners(),
        );
    }

    componentDidUpdate(prevProps: Readonly<TEmulatorProps>) {
        const {props: {emulation, pauseEmulation}} = this;
        emulation.pauseEmulation = pauseEmulation;

        if (prevProps.emulation !== emulation) {
            prevProps.emulation.stopEmulation();
            this.initEmulation();
        }
    }

    private initEmulation(): void {
        const {canvas, props: {emulation}} = this;
        emulation.startEmulation(assertElement(canvas, 'emulator <canvas>'));
    }


    render(): ReactNode {
        const {touchButtons, props: {displayControls, classes}} = this;
        const {gbRight, gbDown, gbLeft, gbUp, gbB, gbA, gbSelect, gbStart, portrait, canvasSize: {widthPx, heightPx}} = this.state;

        const showControls = displayControls !== DisplayControls.HIDDEN;
        const overlayControls = displayControls === DisplayControls.VISIBLE_OVERLAY;
        const cssControlsLeft = cssClasses(classes.controls, classes.controlsLeft, overlayControls ? classes.controlsLeftOverlay : classes.controlsLeftGrid)
        const cssControlsRight = cssClasses(classes.controls, classes.controlsRight, overlayControls ? classes.controlsRightOverlay : classes.controlsRightGrid)

        const canvasStyle: CSSProperties = {
            width: `${widthPx}px`,
            height: `${heightPx}px`,
        };

        return (
            <div className={cssClasses(classes.container, portrait ? classes.portrait : classes.landscape)}
                 ref={(div) => this.containerDiv = div}>

                <div className={classes.screen}
                     ref={(div) => this.screenDiv = div}>

                    <canvas className={classes.canvas}
                            style={canvasStyle}
                            ref={(canvas) => this.canvas = canvas}/>
                </div>

                {showControls
                && <EmulatorCrossControls className={cssControlsLeft}
                                          crossDown={dir => this.buttonDown(dir, touchButtons)}
                                          crossUp={dir => this.buttonUp(dir, touchButtons)}
                                          pressingRight={gbRight}
                                          pressingDown={gbDown}
                                          pressingLeft={gbLeft}
                                          pressingUp={gbUp}/>}
                {showControls
                && <EmulatorButtonControls className={cssControlsRight}
                                           buttonDown={btn => this.buttonDown(btn, touchButtons)}
                                           buttonUp={btn => this.buttonUp(btn, touchButtons)}
                                           pressingB={gbB}
                                           pressingA={gbA}
                                           pressingSelect={gbSelect}
                                           pressingStart={gbStart}/>}
            </div>
        );
    }

    private buttonDown(button: keyof IButtonsDown,
                       buttons: IButtonsDown): void {

        if (!buttons[button]) {
            buttons[button] = true;
            this.checkCombinedButtonState(button);
        }
    }

    private buttonUp(button: keyof IButtonsDown,
                     buttons: IButtonsDown): void {

        if (buttons[button]) {
            buttons[button] = false;
            this.checkCombinedButtonState(button);
        }
    }

    private checkCombinedButtonState(button: keyof IButtonsDown): void {
        const {touchButtons, keyboardButtons, state} = this;

        const buttonDown = touchButtons[button] || keyboardButtons[button];
        if (buttonDown !== state[button]) {
            this.setState({[button]: buttonDown} as any);

            const gbButton = gameboyButton(button);
            if (buttonDown) {
                this.props.emulation.buttonDown(gbButton);
            } else {
                this.props.emulation.buttonUp(gbButton);
            }
        }
    }
}

export const Emulator = withStyles(styles)(
    ComposedEmulator,
);
