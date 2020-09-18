import {ServerStyleSheets} from '@material-ui/core';
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from 'next/document'
import React, {HTMLAttributes} from 'react';
import {Helmet, HelmetData} from 'react-helmet';


interface IAdditionalDocumentProps {
    readonly helmet: HelmetData;
}


/**
 * Material UI SSR:
 * https://material-ui.com/guides/server-rendering/
 * https://github.com/mui-org/material-ui/blob/master/examples/nextjs
 *
 * React Helmet:
 * https://github.com/vercel/next.js/blob/canary/examples/with-react-helmet
 */
export default class AgeOnlineDocument extends Document<IAdditionalDocumentProps> {

    static async getInitialProps(ctx: DocumentContext): Promise<IAdditionalDocumentProps & DocumentInitialProps> {
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
            helmet: Helmet.renderStatic(),
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }


    // should render on <html>
    get helmetHtmlAttrComponents(): HTMLAttributes<HTMLHtmlElement> {
        return this.props.helmet.htmlAttributes.toComponent()
    }

    // should render on <body>
    get helmetBodyAttrComponents(): HTMLAttributes<HTMLBodyElement> {
        return this.props.helmet.bodyAttributes.toComponent()
    }

    // should render on <head>
    get helmetHeadComponents() {
        return Object.keys(this.props.helmet)
            .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
            .map((el) => (this.props.helmet as any)[el].toComponent())
    }


    render(): JSX.Element {
        return (
            <Html {...this.helmetHtmlAttrComponents}>
                <Head>{this.helmetHeadComponents}</Head>
                <body {...this.helmetBodyAttrComponents}><Main/><NextScript/></body>
            </Html>
        );
    }
}
