import {IconButton} from '@material-ui/core';
import {PauseCircleFilled, PlayCircleFilled} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import i18nBundle from './emulator-start-stop-bars.i18n.json';
import {withI18nBundle} from "../i18n";


const ICON_STYLE = {
    fontSize: '60px',
};


export interface IEmulatorStartStopBarProps {
    readonly className?: string;
    readonly emulationPaused: boolean;

    startStopEmulator?(): void;
}

type TEmulatorStartStopBarProps = IEmulatorStartStopBarProps & WithI18nProps;

class ComposedEmulatorStartStopBar extends Component<TEmulatorStartStopBarProps> {

    render(): ReactNode {
        const {className, i18n, emulationPaused, startStopEmulator} = this.props;
        return (
            <div className={className}>

                {!emulationPaused && (
                    <IconButton aria-label={i18n.translate('pause-emulation')}
                                onClick={() => startStopEmulator?.()}>
                        <PauseCircleFilled style={ICON_STYLE}/>
                    </IconButton>
                )}

                {emulationPaused && (
                    <IconButton aria-label={i18n.translate('continue-emulation')}
                                onClick={() => startStopEmulator?.()}>
                        <PlayCircleFilled style={ICON_STYLE}/>
                    </IconButton>
                )}

            </div>
        );
    }
}

export const EmulatorStartStopBar = withI18nBundle('emulator-start-stop-bar', i18nBundle)(
    ComposedEmulatorStartStopBar,
);
