import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {TidyComponent} from '../common';
import {assertElement, cssClasses} from '@age-online/lib-common';
import {elementTouched, TouchEventHandler} from './touch-event-handler';
import {IButtonsDown, noButtonsDown} from './buttons-down';


const CSS_CLASS_PRESSED = 'pressed';

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

        '& > :first-child': {
            marginBottom: theme.spacing(3),
        },
    },

    buttons: {
        '& > *': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: theme.spacing(5),
            color: theme.palette.primary.main,
        },
        '& > :first-child': {
            width: theme.spacing(6),
            border: '3px solid',
            borderTopLeftRadius: '40%',
            borderBottomLeftRadius: '40%',
        },
        '& > :nth-child(2)': {
            width: theme.spacing(3),
            borderTop: '1px dotted',
            borderBottom: '1px dotted',
        },
        '& > :last-child': {
            width: theme.spacing(6),
            border: '3px solid',
            borderTopRightRadius: '40%',
            borderBottomRightRadius: '40%',
        },

        [`& .${CSS_CLASS_PRESSED}`]: {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
        },
    },
});


export interface IButtonControlsProps {
    readonly className?: string;
    readonly buttonDown?: (button: keyof IButtonsDown) => void;
    readonly buttonUp?: (button: keyof IButtonsDown) => void;
    readonly pressingB?: boolean;
    readonly pressingA?: boolean;
    readonly pressingSelect?: boolean;
    readonly pressingStart?: boolean;
}

type TButtonControlsProps = IButtonControlsProps & WithStyles;

class ComposedEmulatorButtonControls extends TidyComponent<TButtonControlsProps> {

    private elemContainer?: HTMLElement | null;

    private elemB?: HTMLElement | null;
    private elemBA?: HTMLElement | null;
    private elemA?: HTMLElement | null;

    private elemSe?: HTMLElement | null;
    private elemSeSt?: HTMLElement | null;
    private elemSt?: HTMLElement | null;

    private readonly buttonsDown = noButtonsDown();

    componentDidMount() {
        const eventHandler = new TouchEventHandler(
            assertElement(this.elemContainer),
            points => {
                const {
                    elemB, elemBA, elemA, elemSe, elemSeSt, elemSt,
                    buttonsDown, props: {buttonDown, buttonUp},
                } = this;

                const ba = elementTouched(assertElement(elemBA), points);
                const b = ba || elementTouched(assertElement(elemB), points);
                const a = ba || elementTouched(assertElement(elemA), points);

                const seSt = elementTouched(assertElement(elemSeSt), points);
                const se = seSt || elementTouched(assertElement(elemSe), points);
                const st = seSt || elementTouched(assertElement(elemSt), points);

                checkButton('gbB', b);
                checkButton('gbA', a);
                checkButton('gbSelect', se);
                checkButton('gbStart', st);

                function checkButton(button: keyof IButtonsDown, buttonState: boolean): void {
                    if (buttonState !== buttonsDown[button]) {
                        buttonsDown[button] = buttonState;
                        (buttonState ? buttonDown : buttonUp)?.(button);
                    }
                }
            },
        );

        this.callOnUnmount(() => eventHandler.removeListeners());
    }

    render(): ReactNode {
        const {props: {classes, className, pressingA, pressingB, pressingStart, pressingSelect}} = this;
        return (
            <div className={cssClasses(classes.container, className)}
                 ref={elem => void (this.elemContainer = elem)}>

                <div className={classes.buttons}>
                    <div className={pressedCss(pressingSelect)}
                         ref={elem => void (this.elemSe = elem)}>select</div>

                    <div className={pressedCss(pressingStart && pressingSelect)}
                         ref={elem => void (this.elemSeSt = elem)}>&#8203;</div>

                    <div className={pressedCss(pressingStart)}
                         ref={elem => void (this.elemSt = elem)}>start</div>
                </div>

                <div className={classes.buttons}>
                    <div className={pressedCss(pressingB)}
                         ref={elem => void (this.elemB = elem)}>B</div>

                    <div className={pressedCss(pressingA && pressingB)}
                         ref={elem => void (this.elemBA = elem)}>&#8203;</div>

                    <div className={pressedCss(pressingA)}
                         ref={elem => void (this.elemA = elem)}>A</div>
                </div>

            </div>
        );

        function pressedCss(flag: unknown): string {
            return flag ? CSS_CLASS_PRESSED : '';
        }
    }
}

export const EmulatorButtonControls = withStyles(styles)(
    ComposedEmulatorButtonControls,
);
