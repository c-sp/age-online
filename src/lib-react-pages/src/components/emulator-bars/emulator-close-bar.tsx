import {IconButton} from '@material-ui/core';
import {Cancel} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import i18nBundle from './emulator-close-bars.i18n.json';
import {TOOLBAR_ICON_STYLE, withI18nBundle} from '@age-online/lib-react';


export interface IEmulatorCloseBarProps {
    readonly className?: string;

    closeEmulator?(): void;
}

type TEmulatorCloseBarProps = IEmulatorCloseBarProps & WithI18nProps;

class ComposedEmulatorCloseBar extends Component<TEmulatorCloseBarProps> {

    render(): ReactNode {
        const {className, i18n, closeEmulator} = this.props;
        return (
            <div className={className}>

                <IconButton aria-label={i18n.translate('close-emulator')}
                            onClick={() => closeEmulator?.()}>
                    <Cancel style={TOOLBAR_ICON_STYLE}/>
                </IconButton>

            </div>
        );
    }
}

export const EmulatorCloseBar = withI18nBundle('emulator-close-bar', i18nBundle)(
    ComposedEmulatorCloseBar,
);
