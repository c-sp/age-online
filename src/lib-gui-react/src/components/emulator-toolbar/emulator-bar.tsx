import {createStyles, fade, Theme, WithStyles, withStyles} from '@material-ui/core';
import {withI18n} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {withI18nBundle} from '../i18n';
import i18nBundle from './emulator-bars.i18n.json';


export function withBarsI18n(): ReturnType<typeof withI18n> {
    return withI18nBundle('emulator-toolbar', i18nBundle);
}


const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: fade(theme.palette.background.default, 0.8),
    },
});

export interface IEmulatorBarProps {
    readonly 'aria-label'?: string;
    readonly className?: string;
}

type TEmulatorBarProps = IEmulatorBarProps & WithStyles;

class ComposedEmulatorBar extends Component<TEmulatorBarProps> {

    render(): ReactNode {
        const {children, classes, className, 'aria-label': ariaLabel} = this.props;
        return (
            <nav className={className ? `${className} ${classes.root}` : classes.root}
                 aria-label={ariaLabel}>

                {children}
            </nav>
        );
    }
}

export const EmulatorBar = withStyles(styles)(
    ComposedEmulatorBar,
);
