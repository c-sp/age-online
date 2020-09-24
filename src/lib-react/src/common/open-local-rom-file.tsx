import React, {Component, ReactNode} from 'react';
import {OpenLocalFile} from './open-local-file';


export interface IOpenLocalRomFileProps {
    openRomFile?(file: File): void;
}


export class OpenLocalRomFile extends Component<IOpenLocalRomFileProps> {

    render(): ReactNode {
        const {children, openRomFile} = this.props;

        // accept=".gb, .gbc, .cgb, .zip":
        // iOS Safari does not support accepting files by extension and instead
        // allows no file to be selected at all ...

        return (
            <OpenLocalFile openFile={file => openRomFile?.(file)}>
                {children}
            </OpenLocalFile>
        );
    }
}
