import {SvgIcon, SvgIconProps} from '@material-ui/core';
import React, {ReactElement} from 'react';


export function EmulatorIcon(props: SvgIconProps): ReactElement {
    return (
        <SvgIcon viewBox={'0 0 100 100'} {...props}>
            {/* Frame */}
            <rect x="20" y="1" rx="5" ry="5" width="60" height="97"
                  fill="none" stroke="currentColor" strokeWidth="6"/>

            {/* Screen */}
            <rect x="30" y="12" rx="1" ry="1" width="40" height="34"
                  fill="none" stroke="currentColor" strokeWidth="6"/>

            {/* Cross */}
            <rect x="34" y="60" rx="1" ry="1" width="6" height="18"/>
            <rect x="28" y="66" rx="1" ry="1" width="18" height="6"/>

            {/* A, B */}
            <circle cx="58" cy="70" r="4"/>
            <circle cx="68" cy="66" r="4"/>
        </SvgIcon>
    );
}
