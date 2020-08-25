import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {BehaviorSubject} from 'rxjs';
import {NavBar, TidyComponent} from '../components';


const styles = createStyles({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    contents: {
        display: 'flex',

        // the page can grow & shrink
        '& > :nth-child(1)': {
            flex: '1 1 0',
            overflow: 'auto',
            maxWidth: '1000px',
            padding: '32px',
        },
    },
    contentsPortrait: {
        flexDirection: 'column',
        alignItems: 'center',

        // the page may use the full width
        // (don't use alignItems: 'stretch' which breaks page alignment)
        '& > :nth-child(1)': {
            width: '100%',
        },
    },
    contentsLandscape: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});


export interface IPageContainerProps {
    readonly children?: ReactNode;
}

type TPageContainerProps = IPageContainerProps & WithStyles;

class ComposedPageContainer extends TidyComponent<TPageContainerProps> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    componentDidMount(): void {
        const {containerDiv, sizeSubject} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );
    }

    render(): JSX.Element {
        const {children, classes} = this.props;

        const containerCssClasses = `MuiTypography-body1 ${classes.container}`;

        return (
            <div className={containerCssClasses}
                 ref={(div) => this.containerDiv = div}>

                <NavBar verticalBar={false}/>
                {children}

            </div>
        );
    }
}

export const PageContainer = withStyles(styles)(
    ComposedPageContainer,
);
