import {AppCommonHead} from '@age-online/lib-gui-react';
import {ServerStyleSheets} from '@material-ui/core';
import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document'
import React from 'react';


/**
 * Material UI SSR:
 * https://material-ui.com/guides/server-rendering/
 * https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
 */
export default class AgeOnlineDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {
        // Resolution order
        //
        // On the server:
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. document.getInitialProps
        // 4. app.render
        // 5. page.render
        // 6. document.render
        //
        // On the server with error:
        // 1. document.getInitialProps
        // 2. app.render
        // 3. page.render
        // 4. document.render
        //
        // On the client
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. app.render
        // 4. page.render

        // Render app and page and get the context of the page with collected side effects.
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }


    render() {
        const {assetPrefix} = this.props;
        return (
            <Html>
                <Head>
                    <AppCommonHead pathPrefix={assetPrefix}/>
                </Head>

                <body><Main/><NextScript/></body>
            </Html>
        );
    }
}
