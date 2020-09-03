import {Skip} from '@age-online/lib-common';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, CSSProperties, ReactNode} from 'react';
import {withI18nBundle} from '../i18n';
import {Cartridge} from '../icons';
import {IOpenLocalFileButtonProps, OpenLocalFileButton} from './open-local-file-button';
import i18nBundle from './open-rom-file-button.i18n.json';


export interface IOpenRomFileButtonAdditionalProps {
    readonly style?: CSSProperties;
    readonly showLabel?: boolean;
}

export type TOpenRomFileButtonProps
    = Skip<IOpenLocalFileButtonProps, 'accept' | 'aria-label' | 'style'> & IOpenRomFileButtonAdditionalProps;

type TOpenRomFileProps = TOpenRomFileButtonProps & WithI18nProps;

class ComposedOpenRomFileButton extends Component<TOpenRomFileProps> {

    render(): ReactNode {
        const {style, showLabel, i18n, color, openFile} = this.props;

        return (
            <OpenLocalFileButton aria-label={i18n.translate('open-rom-file')}
                                 accept=".gb, .gbc, .zip"
                                 openFile={openFile}
                                 color={color}
                                 style={{flexDirection: 'column', fontSize: 'unset'}}>

                <Cartridge style={style}/>
                {showLabel && <span>{i18n.translate('open-rom-file')}</span>}

            </OpenLocalFileButton>
        );
    }
}


export const OpenRomFileButton = withI18nBundle('open-rom-button', i18nBundle)(
    ComposedOpenRomFileButton,
);
