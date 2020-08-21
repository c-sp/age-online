const React = require('react');


// Sort the redirection script to the top as redirection should happen
// preferably before anything has been rendered.

exports.onPreRenderHTML = ({getHeadComponents, replaceHeadComponents}) => {
    const headComponents = getHeadComponents();
    headComponents.sort((x, y) => {
        return x.key === 'i18n-redirect'
            ? -1
            : (y.key === 'i18n-redirect' ? 1 : 0);
    })
    replaceHeadComponents(headComponents);
}


// Add a head script tag for redirecting to a localized version of this page,
// if the locale is not part of the current pathname.

const locales = ['de', 'en']; // TODO redundant
const joinedLocales = locales.map(l => `'${l}'`).join(', ');
// TODO redundant: 'preferredLocale'

function i18nRedirect(path, locales) {
    const {href} = location;
    const idx = href.lastIndexOf(path);
    if (idx < 0) {
        return;
    }

    function storageLoc() {
        try {
            return typeof localStorage === 'undefined' ? '' : localStorage.getItem('preferredLocale');
        } catch (_) {
            return '';
        }
    }

    function sanitizeLoc(loc) {
        return locales.includes(loc) ? loc : 'en';
    }

    const locale = sanitizeLoc(storageLoc() || (typeof navigator === 'undefined' ? '' : navigator.language).slice(0, 2));
    const dst = `${href.slice(0, idx)}/${locale}${href.slice(idx)}`;
    location.replace(dst);
}

exports.onRenderBody = ({setHeadComponents, pathname}) => {
    // remove trailing slash
    pathname = pathname === '/' ? pathname : pathname.replace(/\/$/u, '');

    // no i18n redirect for specific pages
    if (locales.includes(pathname.split('/')[1]) || pathname.includes('offline-plugin-app-shell-fallback')) {
        console.log(`# no i18n redirect for ${pathname}`);
        return;
    }

    // add i18n redirect script to page
    console.log(`# i18n redirect for ${pathname}`);
    setHeadComponents([
        <script key='i18n-redirect' dangerouslySetInnerHTML={{
            __html: `${i18nRedirect.toString()} i18nRedirect('${pathname}', [${joinedLocales}])`,
        }}/>
    ]);
}
