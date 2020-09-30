import {assertElement, cssClasses, IContentSize, IEmulation, observeSize} from '@age-online/lib-core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {CSSProperties, ReactNode} from 'react';
import {DisplayControls} from '../../api';
import {ButtonControls} from './button-controls';
import {CrossControls} from './cross-controls';
import {gameboyButton, IButtonsDown, noButtonsDown} from './buttons-down';
import {KeyboardEventHandler} from './keyboard-event-handler';
import {TidyComponent} from '@age-online/lib-react';


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
        backgroundColor: theme.palette.background.default,
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


export interface IEmulationProps {
    readonly emulation: IEmulation;
    readonly pauseEmulation: boolean;
    readonly displayControls: DisplayControls;
}

interface IEmulationState extends IButtonsDown {
    readonly portrait: boolean;
    readonly canvasSize: IContentSize;
}

type TEmulationProps = IEmulationProps & WithStyles;

class ComposedEmulation extends TidyComponent<TEmulationProps, IEmulationState> {

    private containerDiv: HTMLDivElement | null = null;
    private screenDiv: HTMLDivElement | null = null;
    private canvas: HTMLCanvasElement | null = null;

    private readonly touchButtons = noButtonsDown();
    private readonly keyboardButtons = noButtonsDown();
    private keyboardEventHandler?: KeyboardEventHandler;

    constructor(props: TEmulationProps) {
        super(props);
        this.state = {
            ...noButtonsDown(),
            portrait: true,
            canvasSize: {widthPx: 1, heightPx: 1},
        };
    }


    componentDidMount(): void {
        const {containerDiv, screenDiv, keyboardButtons} = this;

        this.initEmulation();

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
                    const canvasSize: IEmulationState['canvasSize'] = (widthPx / heightPx > 160 / 144)
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

    componentDidUpdate(prevProps: Readonly<TEmulationProps>) {
        const {props: {emulation, pauseEmulation}} = this;
        emulation.pauseEmulation = pauseEmulation;

        if (prevProps.emulation !== emulation) {
            prevProps.emulation.stopEmulation();
            this.initEmulation();
        }
    }

    private initEmulation(): void {
        const {canvas, props: {emulation, pauseEmulation}} = this;
        emulation.pauseEmulation = pauseEmulation;
        emulation.startEmulation(assertElement(canvas, 'emulator <canvas>'));
    }


    render(): ReactNode {
        const {touchButtons, props: {displayControls, classes}} = this;
        const {
            gbRight, gbDown, gbLeft, gbUp, gbB, gbA, gbSelect, gbStart,
            portrait, canvasSize: {widthPx, heightPx},
        } = this.state;

        const showControls = displayControls !== DisplayControls.HIDDEN;

        const overlayControls = displayControls === DisplayControls.VISIBLE_OVERLAY;
        const cssControlsLeft = cssClasses(
            classes.controls, classes.controlsLeft,
            overlayControls ? classes.controlsLeftOverlay : classes.controlsLeftGrid,
        );
        const cssControlsRight = cssClasses(
            classes.controls, classes.controlsRight,
            overlayControls ? classes.controlsRightOverlay : classes.controlsRightGrid,
        );

        const canvasStyle: CSSProperties = {
            width: `${widthPx}px`,
            height: `${heightPx}px`,
        };

        return (
            <div className={cssClasses(classes.container, portrait ? classes.portrait : classes.landscape)}
                 ref={(div) => void (this.containerDiv = div)}>

                <div className={classes.screen}
                     ref={(div) => void (this.screenDiv = div)}>

                    <canvas className={classes.canvas}
                            style={canvasStyle}
                            ref={(canvas) => void (this.canvas = canvas)}/>
                </div>

                {showControls
                && <CrossControls className={cssControlsLeft}
                                  crossDown={dir => this.buttonDown(dir, touchButtons)}
                                  crossUp={dir => this.buttonUp(dir, touchButtons)}
                                  pressingRight={gbRight}
                                  pressingDown={gbDown}
                                  pressingLeft={gbLeft}
                                  pressingUp={gbUp}/>}
                {showControls
                && <ButtonControls className={cssControlsRight}
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
            this.setState({[button]: buttonDown} as Pick<IButtonsDown, keyof IButtonsDown>);

            const gbButton = gameboyButton(button);
            if (buttonDown) {
                this.props.emulation.buttonDown(gbButton);
            } else {
                this.props.emulation.buttonUp(gbButton);
            }
        }
    }
}

export const Emulation = withStyles(styles)(
    ComposedEmulation,
);
