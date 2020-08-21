import {errorInfo} from '@age-online/lib-common';
import {Button, createStyles, WithStyles, withStyles} from '@material-ui/core';
import React, {Component, ReactNode} from 'react';
import {sanitizeLocale} from '../i18n';
import i18nBundle from './error-boundary.i18n.json';


const styles = createStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',

        '& > button': {
            marginTop: '2em',
        },

        '& > *': {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});


export interface IErrorBoundaryProps {
    readonly error?: unknown;
    readonly locale?: string;
    readonly hideReloadButton?: true;
}

interface IErrorBoundaryState {
    readonly error?: unknown;
}

type TErrorBoundaryProps = IErrorBoundaryProps & WithStyles;

/**
 * based on https://reactjs.org/docs/error-boundaries.html
 */
class ComposedErrorBoundary extends Component<TErrorBoundaryProps, IErrorBoundaryState> {

    static getDerivedStateFromError(error: unknown): IErrorBoundaryState {
        return {error};
    }

    static getDerivedStateFromProps({error}: IErrorBoundaryProps,
                                    prevState: IErrorBoundaryState): IErrorBoundaryState | null {
        // don't overwrite any error
        return (prevState.error === undefined) && (error !== undefined)
            ? {error}
            : null;
    }

    constructor(props: TErrorBoundaryProps) {
        super(props);
        const {error} = props;
        this.state = error === undefined ? {} : {error};
    }

    render(): ReactNode {
        const {props: {classes, children, locale, hideReloadButton}, state: {error}} = this;

        if (error === undefined) {
            return children;
        }

        // translate manually as the i18n context might not be available
        const loc = sanitizeLocale(locale);
        const title = i18nBundle.title[loc] || 'something crashed';
        const reloadPage = i18nBundle.reload[loc] || 'reload page';

        return <div className={classes.container}>
            {!hideReloadButton && <Button variant="contained"
                                          color="primary"
                                          onClick={() => location.reload()}>{reloadPage}</Button>}
            {title}
            <pre>{errorInfo(error)}</pre>
        </div>;
    }
}


export const ErrorBoundary = withStyles(styles)(ComposedErrorBoundary);
