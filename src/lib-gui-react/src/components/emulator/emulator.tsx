import {assertElement, cssClasses, IContentSize, observeSize} from '@age-online/lib-common';
import {IEmulation} from '@age-online/lib-emulator';
import {createStyles, fade, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {BehaviorSubject} from 'rxjs';
import {TidyComponent} from '../common';
import {emulatorState, emulatorState$, IEmulatorState} from './emulator-state';


const styles = (theme: Theme) => createStyles({
    container: {
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
        gridArea: 'screen',
        border: '1px solid',
    },
    controls: {
        alignSelf: 'end',
        padding: theme.spacing(1),
        pointerEvents: 'auto',
        backgroundColor: fade(theme.palette.background.default, 0.8),
    },
    controlsLeft: {
        gridArea: 'left-controls',
        justifySelf: 'start',
    },
    controlsRight: {
        gridArea: 'right-controls',
        justifySelf: 'end',
    },
});

export interface IEmulatorProps {
    readonly emulation: IEmulation;
    readonly pauseEmulation: boolean;
}

type TEmulatorProps = IEmulatorProps & WithStyles;

class ComposedEmulator extends TidyComponent<TEmulatorProps, IEmulatorState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TEmulatorProps) {
        super(props);
        this.state = emulatorState(this.sizeSubject.value);
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject} = this;

        const div = assertElement(containerDiv, 'emulator container <div>');
        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );

        this.unsubscribeOnUnmount(
            emulatorState$(sizeSubject.asObservable()).subscribe(state => this.setState(state)),
        );

        this.initEmulation();
    }

    componentDidUpdate(prevProps: Readonly<TEmulatorProps>) {
        if (prevProps.emulation !== this.props.emulation) {
            this.initEmulation();
        }
    }

    render(): ReactNode {
        const {props: {classes}, state: {portrait}} = this;
        return (
            <div className={cssClasses(classes.container, portrait ? classes.portrait : classes.landscape)}
                 ref={(div) => this.containerDiv = div}>

                <div className={classes.screen}/>
                <div className={`${classes.controls} ${classes.controlsLeft}`}>controls left</div>
                <div className={`${classes.controls} ${classes.controlsRight}`}>controls right</div>

            </div>
        );
    }

    private initEmulation(): void {
        // TODO init emulation output
    }
}


export const Emulator = withStyles(styles)(
    ComposedEmulator,
);
