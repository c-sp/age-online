import {createMuiTheme, responsiveFontSizes, Theme, ThemeOptions} from '@material-ui/core';


export function createTheme(additionalGlobalCss?: object,
                            themeOptions?: ThemeOptions): Theme {

    const fontFamily = 'Roboto, Helvetica, Arial, sans-serif';
    const fontFamilyCondensed = 'Roboto Condensed, Roboto, Helvetica, Arial, sans-serif';

    const options: ThemeOptions = {
        ...themeOptions,
        // self hosted fonts:
        // https://material-ui.com/customization/typography/#self-hosted-fonts
        typography: {
            fontFamily,
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    'html, body': {
                        // let <html> match the size of the Initial Containing Block
                        //  => on mobile devices it fills exactly the visible height,
                        //     whether or not the address bar is shown
                        //
                        // see also:
                        //      https://developers.google.com/web/updates/2016/12/url-bar-resizing
                        //      https://bokand.github.io/demo/urlbarsize.html
                        //
                        height: '100%',
                        width: '100%',
                    },
                    ...additionalGlobalCss,
                },
            },
        },
    };

    const theme = responsiveFontSizes(createMuiTheme(options));

    // set global <a> style
    const globalCss = theme.overrides?.MuiCssBaseline?.['@global'] ?? {};
    globalCss.a = {
        color: theme.palette.primary.main,
        textDecoration: 'none',
    };

    // responsive font family
    const variant: (keyof Theme['typography'])[] = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'subtitle1', 'subtitle2',
        'body1', 'body2',
        'button', 'caption', 'overline',
    ];

    const {typography} = theme;
    variant.forEach(v => {
        const typo = typography[v];
        typography[v] = {
            ...typo,
            [theme.breakpoints.down('xs')]: {
                fontFamily: fontFamilyCondensed,
            },
        };
    });

    return theme;
}
