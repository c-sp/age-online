import {createStyles, fade, Theme, withStyles, WithStyles} from "@material-ui/core";
import React, {Component, ReactNode} from "react";
import {cssClasses} from "@age-online/lib-common";


const styles = (theme: Theme) => createStyles({
    overlay: {
        backgroundColor: fade(theme.palette.background.default, 0.8),
    },
});

export interface IEmulatorOverlayProps {
    readonly className?: string;
}

type TEmulatorOverlayProps = IEmulatorOverlayProps & WithStyles;

class ComposedEmulatorOverlay extends Component<TEmulatorOverlayProps> {

    render(): ReactNode {
        const {children, classes, className} = this.props;
        return <div className={cssClasses(classes.overlay, className)}>{children}</div>;
    }
}

export const EmulatorOverlay = withStyles(styles)(
    ComposedEmulatorOverlay,
);
