const React = require('react');

const isDev = process.env.NODE_ENV === 'development';


// Sort the redirection script to the top as redirection should happen
// preferably before anything has been rendered.

exports.onPreRenderHTML = ({getHeadComponents, replaceHeadComponents}) => {
    const headComponents = getHeadComponents();
    headComponents.sort(
        (x, y) => (x.key === 'i18n-redirect'
            ? -1
            : (y.key === 'i18n-redirect' ? 1 : 0)),
    );
    replaceHeadComponents(headComponents);
};


// Add a head script tag for redirecting to a localized version of this page,
// if the locale is not part of the current pathname.

// TODO redundant: list of locales
// TODO redundant: 'age-online:preferred-locale'
const allLocales = ['de', 'en'];
const joinedLocales = allLocales
    .map(l => `'${l}'`)
    .join(', ');

function getLoc(locales) {
    function storageLoc() {
        try {
            return typeof localStorage === 'undefined' ? '' : localStorage.getItem('age-online:preferred-locale');
        } catch (_) {
            return '';
        }
    }

    function sanitizeLoc(loc) {
        return locales.includes(loc) ? loc : 'en';
    }

    return sanitizeLoc(storageLoc() || (typeof navigator === 'undefined' ? '' : navigator.language).slice(0, 2));
}

function i18nRedirect(path, locales) {
    const {href} = location;
    const idx = href.lastIndexOf(path);
    if (idx < 0) {
        return;
    }

    const locale = getLoc(locales);
    const dst = `${href.slice(0, idx)}/${locale}${href.slice(idx)}`;
    location.replace(dst);
}

function devI18nRedirect(locales) {
    const {origin, pathname} = location;
    const parts = pathname.split('/');
    if (locales.includes(parts[1])) {
        return;
    }
    parts.splice(1, 0, getLoc(locales));
    location.replace(`${origin}${parts.join('/')}`);
}


exports.onRenderBody = ({setHeadComponents, pathname}) => {
    // remove trailing slash
    const path = pathname === '/' ? pathname : pathname.replace(/\/$/u, '');

    // no i18n redirect for specific pages
    if (allLocales.includes(path.split('/')[1]) || path.includes('offline-plugin-app-shell-fallback')) {
        console.log(`# no i18n redirect for ${path}`);
        return;
    }

    // add i18n redirect script to page
    console.log(`# ${isDev ? 'dev-' : ''}i18n redirect for ${path}`);
    setHeadComponents([
        isDev
            ? <script key='i18n-redirect' dangerouslySetInnerHTML={{
                __html: `${getLoc.toString()} ${devI18nRedirect.toString()} devI18nRedirect([${joinedLocales}])`,
            }}/>
            : <script key='i18n-redirect' dangerouslySetInnerHTML={{
                __html: `${getLoc.toString()} ${i18nRedirect.toString()} i18nRedirect('${path}', [${joinedLocales}])`,
            }}/>,
    ]);
};
