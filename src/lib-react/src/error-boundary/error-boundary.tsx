import {errorInfo} from '@age-online/lib-core';
import {Button, createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {Component, ReactNode} from 'react';
import i18nBundle from './error-boundary.i18n.json';
import {sanitizeLocale} from '../i18n';


const styles = (theme: Theme) => createStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',

        '& > button': {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
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
    readonly showReloadButton?: boolean;
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

    static getDerivedStateFromProps(nextProps: IErrorBoundaryProps,
                                    prevState: IErrorBoundaryState): IErrorBoundaryState | null {
        // don't overwrite any error
        const error = prevState.error ?? nextProps.error;
        return error ? {error} : null;
    }

    constructor(props: TErrorBoundaryProps) {
        super(props);
        const {error} = props;
        this.state = {error};
    }

    render(): ReactNode {
        const {props: {classes, children, locale, showReloadButton}, state: {error}} = this;

        if ((error === undefined) || (error === null)) {
            return children;
        }

        // translate manually as the i18n context might not be available
        const loc = sanitizeLocale(locale);
        const title = i18nBundle.title[loc] || 'something crashed';
        const reloadPage = i18nBundle.reload[loc] || 'reload page';

        return <div className={classes.container}>
            {showReloadButton && <Button variant="contained"
                                         color="primary"
                                         onClick={() => location.reload()}>{reloadPage}</Button>}
            <div>{title}</div>
            <pre>{errorInfo(error)}</pre>
        </div>;
    }
}


export const ErrorBoundary = withStyles(styles)(ComposedErrorBoundary);
