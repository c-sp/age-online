import {createMuiTheme, responsiveFontSizes, Theme, ThemeOptions} from '@material-ui/core';


export function createTheme(fontsPath: string,
                            additionalGlobalCss?: object,
                            themeOptions?: ThemeOptions): Theme {

    const fontFamily = 'Roboto, Helvetica, Arial, sans-serif';
    const fontFamilyCondensed = 'Roboto Condensed, Helvetica, Arial, sans-serif';

    // TODO add "prefetch" font <link> elements
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
                    '@font-face': [
                        fontFaceRoboto(fontsPath),
                        fontFaceRobotoCondensed(fontsPath),
                    ],
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
                    ...additionalGlobalCss,
                },
            },
        },
    };

    const theme = responsiveFontSizes(createMuiTheme(options));

    // set global <a> style
    const globalCss = theme.overrides!.MuiCssBaseline!['@global']!;
    globalCss.a = {
        color: theme.palette.primary.main,
        textDecoration: 'none',
    };

    // responsive font family
    const typography = theme.typography as any;
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'button', 'caption', 'overline']
        .forEach(
            variant => typography[variant] = {
                ...typography[variant],
                [theme.breakpoints.down('xs')]: {
                    fontFamily: fontFamilyCondensed,
                },
            },
        );

    return theme;
}


/**
 * @see https://google-webfonts-helper.herokuapp.com/fonts/roboto?subsets=latin
 */
function fontFaceRoboto(fontsPath: string): object {
    return {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: `
            local('Roboto'), local('Roboto-Regular'),
            url('${fontsPath}/roboto/roboto-v20-latin-regular.woff2') format('woff2'),
            url('${fontsPath}/roboto/roboto-v20-latin-regular.woff') format('woff')
        `,
    };
}


/**
 * @see https://google-webfonts-helper.herokuapp.com/fonts/roboto-condensed?subsets=latin
 */
function fontFaceRobotoCondensed(fontsPath: string): object {
    return {
        fontFamily: 'Roboto Condensed',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: `
            local('Roboto Condensed'), local('RobotoCondensed-Regular'),
            url('${fontsPath}/roboto-condensed/roboto-condensed-v18-latin-regular.woff2') format('woff2'),
            url('${fontsPath}/roboto-condensed/roboto-condensed-v18-latin-regular.woff') format('woff')
        `,
    };
}
