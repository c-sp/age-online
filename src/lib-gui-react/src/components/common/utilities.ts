import {fade, Theme} from "@material-ui/core";

/**
 * properties to be used for external links
 */
export const EXTERNAL_LINK_PROPS = {
    target: '_blank',
    rel: 'noopener noreferrer',
};


/**
 * To override Material UI styles for icon buttons we have to use a custom
 * CSSProperties instance.
 */
export const TOOLBAR_ICON_STYLE = {
    fontSize: '40px',
};


export function overlayBackgroundColor(theme: Theme): string {
    return fade(theme.palette.background.default, 0.8);
}
