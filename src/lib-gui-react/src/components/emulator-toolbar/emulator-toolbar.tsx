import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component} from 'react';
import {TOOLBAR_ICON_STYLE} from '../common';
import {OpenRomFileButton} from '../open-local-file';
import {SettingsIconSiteLink} from '../site-api';
import {EmulatorBar, IEmulatorBarProps, withBarsI18n} from './emulator-bar';


export interface IEmulatorToolbarProps extends IEmulatorBarProps {
    openRomFile?(file: File): void;
}

type TEmulatorToolbarProps = IEmulatorToolbarProps & WithI18nProps;

class ComposedEmulatorToolbar extends Component<TEmulatorToolbarProps> {

    render(): JSX.Element {
        const {className, i18n} = this.props;
        return (
            <EmulatorBar className={className}
                         aria-label={i18n.translate('bar-label')}>

                <OpenRomFileButton style={TOOLBAR_ICON_STYLE}/>
                <SettingsIconSiteLink style={TOOLBAR_ICON_STYLE}/>

            </EmulatorBar>
        );
    }
}

export const EmulatorToolbar = withBarsI18n()(
    ComposedEmulatorToolbar,
);
