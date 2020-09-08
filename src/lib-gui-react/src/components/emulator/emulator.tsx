import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {IEmulation} from '@age-online/lib-emulator';
import {createStyles, fade, Theme, WithStyles, withStyles} from '@material-ui/core';
import React from 'react';
import {ReactNode} from 'react';
import {BehaviorSubject} from 'rxjs';
import {TidyComponent} from '../common';


const styles = (theme: Theme) => createStyles({
    container: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    controlsLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: theme.spacing(1),
        pointerEvents: 'auto',
        backgroundColor: fade(theme.palette.background.default, 0.8),
    },
    controlsRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: theme.spacing(1),
        pointerEvents: 'auto',
        backgroundColor: fade(theme.palette.background.default, 0.8),
    },
});

export interface IEmulatorProps {
    readonly emulation: IEmulation;
    readonly pauseEmulation: boolean;
}

interface IEmulatorState {
    readonly portrait: boolean;
}

type TEmulatorProps = IEmulatorProps & WithStyles;

class ComposedEmulator extends TidyComponent<TEmulatorProps, IEmulatorState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TEmulatorProps) {
        super(props);
        this.state = {portrait: true};
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject} = this;

        const div = assertElement(containerDiv, 'emulator container <div>');
        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );

        // TODO init emulation output

        // this.unsubscribeOnUnmount(
        //     this.props.currentAppState.appState$('preferredTheme').subscribe(
        //         ({preferredTheme}) => this.setState({preferredTheme}),
        //     ),
        // );
    }

    componentDidUpdate() {
        // only the pause-flag is updated without re-mounting
    }

    render(): ReactNode {
        const {classes} = this.props;

        return (
            <div className={classes.container}
                 ref={(div) => this.containerDiv = div}>

                <div className={classes.controlsLeft}>controls left</div>
                <div className={classes.controlsRight}>controls right</div>

            </div>
        );
    }
}


export const Emulator = withStyles(styles)(
    ComposedEmulator,
);
