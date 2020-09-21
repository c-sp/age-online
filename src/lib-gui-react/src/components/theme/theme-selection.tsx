import {assertNever, formatValue} from '@age-online/lib-common';
import {createStyles, Mark, Slider, withStyles, WithStyles} from '@material-ui/core';
import {NightsStay, PhonelinkSetup, WbSunny} from '@material-ui/icons';
import {I18n, WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {withI18nBundle} from '../i18n';
import {PreferredTheme} from './preferred-theme';
import i18nBundle from './theme-selection.i18n.json';


const ThemeSlider = withStyles({
    root: {
        height: 8,
    },
    thumb: {
        height: 16,
        width: 16,
        marginTop: -4,
        marginLeft: -8,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    mark: {
        display: 'none',
    },
    markLabel: {
        paddingTop: 4,
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);


const styles = createStyles({
    themeSelection: {
        display: 'flex',
        alignItems: 'center',

        '& > :first-child': {
            width: '100px',
        },
    },
});

export interface IThemeSelectionProps {
    readonly preferredTheme: PreferredTheme;
    readonly preferTheme?: (themePreference: PreferredTheme) => void;
}

type TThemeSelectionProps = IThemeSelectionProps & WithStyles & WithI18nProps;


export class ComposedThemeSelection extends Component<TThemeSelectionProps> {

    render(): ReactNode {
        const {classes, i18n, preferredTheme, preferTheme} = this.props;

        return (
            <div className={classes.themeSelection}>
                <ThemeSlider value={toSliderValue(preferredTheme)}
                             onChange={(_, newValue): void => {
                                 const pref = fromSliderValue(newValue);
                                 if (preferTheme && pref !== preferredTheme) {
                                     preferTheme(pref);
                                 }
                             }}
                             color="primary"
                             aria-labelledby="theme-label"
                             min={0}
                             max={2}
                             marks={sliderMarks(i18n)}
                             step={1}
                             track={false}/>
            </div>
        );
    }
}

export const ThemeSelection = withStyles(styles)(
    withI18nBundle('theme-selection', i18nBundle)(
        ComposedThemeSelection,
    ),
);


function toSliderValue(themePreference: PreferredTheme): number {
    switch (themePreference) {
        case PreferredTheme.LIGHT:
            return 0;
        case PreferredTheme.AUTO_DETECT:
            return 1;
        case PreferredTheme.DARK:
            return 2;
        default:
            return assertNever(themePreference);
    }
}

function fromSliderValue(sliderValue: number | readonly number[]): PreferredTheme {
    switch (sliderValue) {
        case 0:
            return PreferredTheme.LIGHT;
        case 1:
            return PreferredTheme.AUTO_DETECT;
        case 2:
            return PreferredTheme.DARK;
        default:
            throw new Error(`unexpected slider value: ${formatValue(sliderValue)}`);
    }
}

function sliderMarks(i18n: I18n): Mark[] {
    return [
        {
            value: 0,
            label: <WbSunny aria-label={i18n.translate('label:theme-light')}/>,
        },
        {
            value: 1,
            label: <PhonelinkSetup aria-label={i18n.translate('label:theme-auto-detect')}/>,
        },
        {
            value: 2,
            label: <NightsStay aria-label={i18n.translate('label:theme-dark')}/>,
        },
    ];
}
