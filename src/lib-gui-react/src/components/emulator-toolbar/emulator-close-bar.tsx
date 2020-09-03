import {IconButton} from '@material-ui/core';
import {Cancel} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component} from 'react';
import {TOOLBAR_ICON_STYLE} from '../common';
import {EmulatorBar, IEmulatorBarProps, withBarsI18n} from './emulator-bar';


export interface IEmulatorCloseBarProps extends IEmulatorBarProps {
    closeEmulator?(): void;
}

type TEmulatorCloseBarProp = IEmulatorCloseBarProps & WithI18nProps;

class ComposedEmulatorCloseBar extends Component<TEmulatorCloseBarProp> {

    render(): JSX.Element {
        const {className, i18n, closeEmulator} = this.props;
        return (
            <EmulatorBar className={className}
                         aria-label={i18n.translate('bar-label')}>

                <IconButton aria-label={i18n.translate('close-emulator')}
                            onClick={() => closeEmulator?.()}>
                    <Cancel style={TOOLBAR_ICON_STYLE}/>
                </IconButton>

            </EmulatorBar>
        );
    }
}

export const EmulatorCloseBar = withBarsI18n()(
    ComposedEmulatorCloseBar,
);
