import React, {Component, ReactNode} from 'react';


export interface IOpenLocalFileProps {
    readonly accept?: string;

    openFile?(file: File): void;
}


export class OpenLocalFile extends Component<IOpenLocalFileProps> {

    render(): ReactNode {
        const {children, accept, openFile} = this.props;
        return <>
            <label htmlFor="input-local-file">
                {children}
            </label>

            <input id="input-local-file"
                   style={{display: 'none'}}
                   type="file"
                   accept={accept}
                   onChange={(ev) => {
                       const {files} = ev.target;
                       if (files?.length) {
                           openFile?.(files[0]);
                           // reset the <input>'s value so that selecting the
                           // same file again triggers another event
                           ev.target.value = '';
                       }
                   }}/>
        </>;
    }
}
