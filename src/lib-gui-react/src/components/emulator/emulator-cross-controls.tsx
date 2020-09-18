import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {TidyComponent} from '../common';
import {assertElement, cssClasses} from '@age-online/lib-common';
import {elementTouched, TouchEventHandler} from './touch-event-handler';
import {IButtonsDown, noButtonsDown} from './buttons-down';


const CSS_CLASS_PRESSED = 'pressed';
const CSS_RADIUS_DIRECTIONS = '20%';


const styles = (theme: Theme) => createStyles({
    container: {
        // No browser gesture handling for this element,
        // we handle touch events all by ourselves.
        // See also:
        // https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        touchAction: 'none',

        // no selectable text
        userSelect: 'none',
    },

    cross: {
        height: theme.spacing(3 * 5),
        width: theme.spacing(3 * 5),
        color: theme.palette.primary.main,

        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateAreas: '"up-left up up-right" "left unused right" "down-left down down-right"',

        [`& .${CSS_CLASS_PRESSED}`]: {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
        }
    },
    upLeft: {
        gridArea: 'up-left',
        borderTop: '1px dotted',
        borderLeft: '1px dotted',
        borderTopLeftRadius: '100%',
    },
    up: {
        gridArea: 'up',
        border: '3px solid',
        borderBottom: '1px dotted',
        borderTopLeftRadius: CSS_RADIUS_DIRECTIONS,
        borderTopRightRadius: CSS_RADIUS_DIRECTIONS,
    },
    upRight: {
        gridArea: 'up-right',
        borderTop: '1px dotted',
        borderRight: '1px dotted',
        borderTopRightRadius: '100%',
    },
    left: {
        gridArea: 'left',
        border: '3px solid',
        borderRight: '1px dotted',
        borderTopLeftRadius: CSS_RADIUS_DIRECTIONS,
        borderBottomLeftRadius: CSS_RADIUS_DIRECTIONS,
    },
    right: {
        gridArea: 'right',
        border: '3px solid',
        borderLeft: '1px dotted',
        borderTopRightRadius: CSS_RADIUS_DIRECTIONS,
        borderBottomRightRadius: CSS_RADIUS_DIRECTIONS,
    },
    downLeft: {
        gridArea: 'down-left',
        borderBottom: '1px dotted',
        borderLeft: '1px dotted',
        borderBottomLeftRadius: '100%',
    },
    down: {
        gridArea: 'down',
        border: '3px solid',
        borderTop: '1px dotted',
        borderBottomLeftRadius: CSS_RADIUS_DIRECTIONS,
        borderBottomRightRadius: CSS_RADIUS_DIRECTIONS,
    },
    downRight: {
        gridArea: 'down-right',
        borderBottom: '1px dotted',
        borderRight: '1px dotted',
        borderBottomRightRadius: '100%',
    },
});


export interface ICrossControlsProps {
    readonly className?: string;
    readonly crossDown?: (button: keyof IButtonsDown) => void;
    readonly crossUp?: (button: keyof IButtonsDown) => void;
    readonly pressingRight?: boolean;
    readonly pressingDown?: boolean;
    readonly pressingLeft?: boolean;
    readonly pressingUp?: boolean;
}

type TCrossControlsProps = ICrossControlsProps & WithStyles;

class ComposedEmulatorCrossControls extends TidyComponent<TCrossControlsProps> {

    private elemContainer?: HTMLElement | null;

    private elemUpLeft?: HTMLElement | null;
    private elemUp?: HTMLElement | null;
    private elemUpRight?: HTMLElement | null;

    private elemLeft?: HTMLElement | null;
    private elemRight?: HTMLElement | null;

    private elemDownLeft?: HTMLElement | null;
    private elemDown?: HTMLElement | null;
    private elemDownRight?: HTMLElement | null;

    private readonly buttonsDown = noButtonsDown();

    componentDidMount() {
        const eventHandler = new TouchEventHandler(
            assertElement(this.elemContainer),
            points => {
                const {
                    elemUpLeft, elemUp, elemUpRight, elemLeft, elemRight, elemDownLeft, elemDown, elemDownRight,
                    buttonsDown, props: {crossDown, crossUp},
                } = this;

                const ul = elementTouched(assertElement(elemUpLeft), points);
                const ur = elementTouched(assertElement(elemUpRight), points);
                const dl = elementTouched(assertElement(elemDownLeft), points);
                const dr = elementTouched(assertElement(elemDownRight), points);

                const r = ur || dr || elementTouched(assertElement(elemRight), points);
                const d = dl || dr || elementTouched(assertElement(elemDown), points);
                const l = ul || dl || elementTouched(assertElement(elemLeft), points);
                const u = ul || ur || elementTouched(assertElement(elemUp), points);

                checkButton('gbRight', r);
                checkButton('gbDown', d);
                checkButton('gbLeft', l);
                checkButton('gbUp', u);

                function checkButton(button: keyof IButtonsDown, buttonState: boolean): void {
                    if (buttonState !== buttonsDown[button]) {
                        buttonsDown[button] = buttonState;
                        (buttonState ? crossDown : crossUp)?.(button);
                    }
                }
            },
        );

        this.callOnUnmount(() => eventHandler.removeListeners());
    }

    render(): ReactNode {
        const {props: {classes, className, pressingRight, pressingDown, pressingLeft, pressingUp}} = this;
        return (
            <div className={cssClasses(classes.container, className)}
                 ref={elem => this.elemContainer = elem}>

                <div className={classes.cross}>

                    <div className={cssClasses(classes.upLeft, pressedCss(pressingLeft && pressingUp))}
                         ref={elem => this.elemUpLeft = elem}>&#8203;</div>

                    <div className={cssClasses(classes.up, pressedCss(pressingUp))}
                         ref={elem => this.elemUp = elem}>&#8203;</div>

                    <div className={cssClasses(classes.upRight, pressedCss(pressingRight && pressingUp))}
                         ref={elem => this.elemUpRight = elem}>&#8203;</div>

                    <div className={cssClasses(classes.left, pressedCss(pressingLeft))}
                         ref={elem => this.elemLeft = elem}>&#8203;</div>

                    <div className={cssClasses(classes.right, pressedCss(pressingRight))}
                         ref={elem => this.elemRight = elem}>&#8203;</div>

                    <div className={cssClasses(classes.downLeft, pressedCss(pressingLeft && pressingDown))}
                         ref={elem => this.elemDownLeft = elem}>&#8203;</div>

                    <div className={cssClasses(classes.down, pressedCss(pressingDown))}
                         ref={elem => this.elemDown = elem}>&#8203;</div>

                    <div className={cssClasses(classes.downRight, pressedCss(pressingRight && pressingDown))}
                         ref={elem => this.elemDownRight = elem}>&#8203;</div>

                </div>

            </div>
        );

        function pressedCss(flag: unknown): string {
            return flag ? CSS_CLASS_PRESSED : '';
        }
    }
}

export const EmulatorCrossControls = withStyles(styles)(
    ComposedEmulatorCrossControls,
);
