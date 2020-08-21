import {RadioGroup, SvgIcon, withStyles} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React, {Component, ReactNode} from 'react';
import {SVG_FLAG_DE, SVG_FLAG_US} from '../common';
import {sanitizeLocale, TLocale} from './with-i18n-bundle';


const StyledRadio = withStyles({
    root: {
        padding: '4px',
        marginLeft: '8px',
        marginRight: '8px',
        border: '2px solid transparent',
    },
    checked: {
        border: '2px solid',
    },
})(Radio);

const LOCALE_DE: TLocale = 'de';
const LOCALE_EN: TLocale = 'en';


export interface ILanguageSelectionProps {
    readonly selectedLanguage?: string | null;
    readonly color?: 'primary' | 'secondary' | 'default';
    readonly onSelect?: (locale: TLocale) => void;
}

class ComposedLocaleSelection extends Component<ILanguageSelectionProps> {

    render(): ReactNode {
        const {props} = this;
        const {color, onSelect, selectedLanguage} = props;

        const svgDe = <SvgIcon fontSize="large">{SVG_FLAG_DE}</SvgIcon>;
        const svgEn = <SvgIcon fontSize="large">{SVG_FLAG_US}</SvgIcon>;

        return <RadioGroup value={selectedLanguage}
                           onChange={(ev): void => onSelect?.(sanitizeLocale(ev.target.value))}
                           aria-label="language"
                           name="language-selection">

            <FormControlLabel value={LOCALE_DE}
                              label="Deutsch"
                              control={
                                  <StyledRadio icon={svgDe} checkedIcon={svgDe} color={color}/>
                              }/>

            <FormControlLabel value={LOCALE_EN}
                              label="English"
                              control={
                                  <StyledRadio icon={svgEn} checkedIcon={svgEn} color={color}/>
                              }/>
        </RadioGroup>;
    }
}


export const LocaleSelection = ComposedLocaleSelection;
