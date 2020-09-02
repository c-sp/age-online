import {createStyles, IconButton, WithStyles, withStyles} from '@material-ui/core';
import React, {Component, CSSProperties, ReactNode} from 'react';


const styles = createStyles({
    input: {
        display: 'none',
    },
});

export interface IOpenLocalFileProps {
    readonly 'aria-label'?: string;
    readonly accept?: string;
    readonly style?: CSSProperties;

    openFile?(file: File): void;
}

type TOpenLocalFileProps = IOpenLocalFileProps & WithStyles;

class ComposedOpenLocalFile extends Component<TOpenLocalFileProps> {

    private fileInput: HTMLInputElement | null = null;

    render(): ReactNode {
        const {children, 'aria-label': ariaLabel, classes, accept, style, openFile} = this.props;

        return <>
            <IconButton aria-label={ariaLabel}
                        onClick={() => this.fileInput?.click()}
                        style={style}>
                {children}
            </IconButton>

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


export const OpenLocalFile = withStyles(styles)(
    ComposedOpenLocalFile,
);
