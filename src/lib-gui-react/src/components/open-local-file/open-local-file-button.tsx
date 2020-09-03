import {createStyles, IconButton, PropTypes, WithStyles, withStyles} from '@material-ui/core';
import React, {Component, CSSProperties, ReactNode} from 'react';


const styles = createStyles({
    input: {
        display: 'none',
    },
});

const StyledIconButton = withStyles({
    label: {
        // allow "flex-direction: column" being set by style-prop
        flexDirection: 'inherit',
    }
})(IconButton);


export interface IOpenLocalFileButtonProps {
    readonly 'aria-label'?: string;
    readonly accept?: string;
    readonly color?: PropTypes.Color;
    readonly style?: CSSProperties;

    openFile?(file: File): void;
}

type TOpenLocalFileProps = IOpenLocalFileButtonProps & WithStyles;

class ComposedOpenLocalFileButton extends Component<TOpenLocalFileProps> {

    private fileInput: HTMLInputElement | null = null;

    render(): ReactNode {
        const {children, 'aria-label': ariaLabel, classes, accept, color, style, openFile} = this.props;

        return <>
            <StyledIconButton aria-label={ariaLabel}
                              onClick={() => this.fileInput?.click()}
                              color={color}
                              style={style}>
                {children}
            </StyledIconButton>

            <input className={classes.input}
                   ref={(fileInput) => this.fileInput = fileInput}
                   type="file"
                   accept={accept}
                   onChange={(ev) => {
                       const {files} = ev.target;
                       if (files && files.length && openFile) {
                           openFile(files[0]);
                       }
                   }}/>
        </>;
    }
}


export const OpenLocalFileButton = withStyles(styles)(
    ComposedOpenLocalFileButton,
);
