import {SvgIcon, SvgIconProps} from '@material-ui/core';
import React, {ReactElement} from 'react';


export function Cartridge(props: SvgIconProps): ReactElement {
    return (
        <SvgIcon viewBox={'0 0 100 100'} {...props}>
            <path d={`
                M10 5 h65 v7 h15 v83 h-80z

                M20 25a8 8 0 0 0 8 8h42a8 8 0 0 0 8 -8a8 8 0 0 0 -8 -8h-42a8 8 0 0 0 -8 8z
                M24 25a4 4 0 0 0 4 4h42a4 4 0 0 0 4 -4a4 4 0 0 0 -4 -4h-42a4 4 0 0 0 -4 4z

                M20 82a4 4 0 0 0 4 4h50a4 4 0 0 0 4 -4v-37a4 4 0 0 0 -4 -4h-50a4 4 0 0 0 -4 4z
                M24 82              h50               v-37                h-50               z
                `}/>
        </SvgIcon>
    );
}
