import React, {Component, ReactNode} from 'react';
import {OpenLocalFile} from './open-local-file';


export interface IOpenLocalRomFileProps {
    openRomFile?(file: File): void;
}


export class OpenLocalRomFile extends Component<IOpenLocalRomFileProps> {

    render(): ReactNode {
        const {children, openRomFile} = this.props;
        return (
            <OpenLocalFile accept=".gb, .gbc, .zip" openFile={file => openRomFile?.(file)}>
                {children}
            </OpenLocalFile>
        );
    }
}
