import {createMuiTheme, responsiveFontSizes, Theme, ThemeOptions} from '@material-ui/core';


// TODO move this to AppStateManager
export function createTheme(themeOptions?: ThemeOptions): Theme {
    const options: ThemeOptions = {
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    html: {
                        // let <html> match the size of the Initial Containing Block
                        //  => on mobile devices it fills exactly the visible height,
                        //     whether or not the address bar is shown
                        // (see also: https://developers.google.com/web/updates/2016/12/url-bar-resizing)
                        position: 'fixed',
                        height: '100%',
                        width: '100%',
                    },
                    body: {
                        height: '100%',
                        width: '100%',
                    },
                    '#___gatsby, #___gatsby > div': { // TODO move this to ISiteApi
                        height: '100%',
                    },
                },
            },
        },
        ...themeOptions,
    };

    const theme = responsiveFontSizes(createMuiTheme(options));

    // set global <a> style
    const globalCss = theme.overrides?.MuiCssBaseline?.['@global'];
    if (globalCss) {
        globalCss.a = {
            color: theme.palette.primary.main,
            textDecoration: 'none',
        };
    }

    return theme;
}
