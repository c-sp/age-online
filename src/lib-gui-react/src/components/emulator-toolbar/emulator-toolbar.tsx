import {IconButton} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {OpenLocalRomFile, TOOLBAR_ICON_STYLE} from '../common';
import {Cartridge} from '../icons';
import {SettingsIconSiteLink} from '../site-api';
import {EmulatorBar, IEmulatorBarProps, withBarsI18n} from './emulator-bar';


export interface IEmulatorToolbarProps extends IEmulatorBarProps {
    openRomFile?(file: File): void;
}

type TEmulatorToolbarProps = IEmulatorToolbarProps & WithI18nProps;

class ComposedEmulatorToolbar extends Component<TEmulatorToolbarProps> {

    render(): ReactNode {
        const {className, i18n, openRomFile} = this.props;
        return (
            <EmulatorBar className={className}
                         aria-label={i18n.translate('bar-label')}>

                <OpenLocalRomFile openRomFile={file => openRomFile?.(file)}>
                    <IconButton component="span" aria-label={i18n.translate('open-rom-file')}>
                        <Cartridge style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                </OpenLocalRomFile>

                <SettingsIconSiteLink style={TOOLBAR_ICON_STYLE}/>

            </EmulatorBar>
        );
    }
}

export const EmulatorToolbar = withBarsI18n()(
    ComposedEmulatorToolbar,
);
