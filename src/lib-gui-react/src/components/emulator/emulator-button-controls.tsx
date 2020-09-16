import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {PureComponent, ReactNode} from 'react';
import {EmulatorOverlay} from '../common';
import {cssClasses} from "@age-online/lib-common";
import {ControlEventHandler} from "./control-event-handler";


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
            width: theme.spacing(5),
            color: theme.palette.primary.main,
        },
        '& > :first-child': {
            border: '3px solid',
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
        },
        '& > :nth-child(2)': {
            borderTop: '1px solid',
            borderBottom: '1px solid',
        },
        '& > :last-child': {
            border: '3px solid',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%',
        },

        '& .pressed': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
        }
    },
});


export interface IButtonControlsProps {
    readonly className?: string;
    readonly pressingA?: boolean;
    readonly pressingB?: boolean;
    readonly pressingStart?: boolean;
    readonly pressingSelect?: boolean;
}

type TButtonControlsProps = IButtonControlsProps & WithStyles;

class ComposedEmulatorButtonControls extends PureComponent<TButtonControlsProps> {

    private readonly seStEventHandler = new ControlEventHandler((points, elem) => {
        const startPressed = points.some(p => p.elementX >= elem.clientWidth / 3);
        const selectPressed = points.some(p => p.elementX < elem.clientWidth * 2 / 3);
        console.log('### start', startPressed, 'select', selectPressed);
    });

    render(): ReactNode {
        const {seStEventHandler, props: {classes, className, pressingA, pressingB, pressingStart, pressingSelect}} = this;
        return (
            <EmulatorOverlay className={cssClasses(classes.container, className)}>

                <div className={classes.buttons}
                     onMouseDown={ev => seStEventHandler.onMouse(ev)}
                     onMouseLeave={ev => seStEventHandler.onMouse(ev)}
                     onMouseMove={ev => seStEventHandler.onMouse(ev)}
                     onMouseUp={ev => seStEventHandler.onMouse(ev)}
                     onTouchCancel={ev => seStEventHandler.onTouch(ev)}
                     onTouchEnd={ev => seStEventHandler.onTouch(ev)}
                     onTouchMove={ev => seStEventHandler.onTouch(ev)}
                     onTouchStart={ev => seStEventHandler.onTouch(ev)}>

                    <div className={pressedCss(pressingSelect)}>SE</div>
                    <div className={pressedCss(pressingStart && pressingSelect)}>&#8203;</div>
                    <div className={pressedCss(pressingStart)}>ST</div>
                </div>

                <div className={classes.buttons}>
                    <div className={pressedCss(pressingB)}>B</div>
                    <div className={pressedCss(pressingA && pressingB)}>&#8203;</div>
                    <div className={pressedCss(pressingA)}>A</div>
                </div>

            </EmulatorOverlay>
        );
    }
}

export const EmulatorButtonControls = withStyles(styles)(
    ComposedEmulatorButtonControls,
);


function pressedCss(flag: unknown): string {
    return !!flag ? 'pressed' : '';
}
