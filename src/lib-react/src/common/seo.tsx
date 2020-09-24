import {WithI18nProps} from '@shopify/react-i18n';
import React, {ReactElement} from 'react';
import {Helmet, HelmetProps} from 'react-helmet';


export function SEO({i18n}: WithI18nProps): ReactElement {
    const lang = i18n.locale;

    const title = i18n.translationKeyExists('seo:title')
        ? i18n.translate('seo:title')
        : i18n.translate('page:heading');

    const description = i18n.translate('seo:description');
    const author = 'Christoph Sprenger';

    if (!title) {
        throw new Error('SEO title / page title missing');
    }
    if (!description) {
        throw new Error('SEO description missing');
    }

    return <Helmet htmlAttributes={{lang}}
                   title={title}
                   meta={meta({lang, author, description, title})}/>;
}


function meta(options: {
    readonly lang: string;
    readonly title: string;
    readonly description: string;
    readonly author: string;
}): HelmetProps['meta'] {

    const {lang, author, description, title} = options;
    return [
        {
            name: 'description',
            content: description,
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:type',
            content: 'website',
        },
        {
            property: 'og:locale',
            content: lang,
        },
        {
            name: 'twitter:card',
            content: 'summary',
        },
        {
            name: 'twitter:creator',
            content: author,
        },
        {
            name: 'twitter:title',
            content: title,
        },
        {
            name: 'twitter:description',
            content: description,
        },
    ];
}
