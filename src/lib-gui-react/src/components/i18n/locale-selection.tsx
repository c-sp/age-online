import {RadioGroup, SvgIcon, withStyles} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React, {Component, ReactNode} from 'react';
import {SVG_FLAG_DE, SVG_FLAG_US} from '../common';
import {sanitizeLocale, Locale} from './locale';


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

const StylesFormControlLabel = withStyles({
    root: {
        marginLeft: 0,
        marginRight: 0,
    }
})(FormControlLabel);


export interface ILocaleSelectionProps {
    readonly selectedLocale?: string | null;
    readonly color?: 'primary' | 'secondary' | 'default';
    readonly onSelect?: (locale: Locale) => void;
}

class ComposedLocaleSelection extends Component<ILocaleSelectionProps> {

    render(): ReactNode {
        const {props} = this;
        const {color, onSelect, selectedLocale} = props;

        const svgDe = <SvgIcon fontSize="large">{SVG_FLAG_DE}</SvgIcon>;
        const svgEn = <SvgIcon fontSize="large">{SVG_FLAG_US}</SvgIcon>;

        return <RadioGroup value={selectedLocale}
                           onChange={(ev): void => onSelect?.(sanitizeLocale(ev.target.value))}
                           aria-label="locale"
                           name="locale-selection"
                           row={true}>

            <StylesFormControlLabel value={Locale.EN}
                                    label=""
                                    control={
                                        <StyledRadio icon={svgEn} checkedIcon={svgEn} color={color}/>
                                    }/>

            <StylesFormControlLabel value={Locale.DE}
                                    label=""
                                    control={
                                        <StyledRadio icon={svgDe} checkedIcon={svgDe} color={color}/>
                                    }/>
        </RadioGroup>;
    }
}


export const LocaleSelection = ComposedLocaleSelection;
