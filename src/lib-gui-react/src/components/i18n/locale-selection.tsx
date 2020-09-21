import {RadioGroup, withStyles} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React, {Component, ReactNode} from 'react';
import {FlagDE, FlagUS} from '../icons';
import {Locale, sanitizeLocale} from './locale';


const StyledRadio = withStyles(theme => ({
    root: {
        padding: theme.spacing(0.5),
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        border: '3px solid transparent',
    },
    checked: {
        border: '3px solid',
    },
}))(Radio);

const StylesFormControlLabel = withStyles({
    root: {
        marginLeft: 0,
        marginRight: 0,
    },
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

        const svgDe = <FlagDE fontSize="large"/>;
        const svgEn = <FlagUS fontSize="large"/>;

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
