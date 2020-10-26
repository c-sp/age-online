// import side effects
// eslint-disable-next-line import/no-unassigned-import
import 'audioworklet-polyfill';


// see https://www.gatsbyjs.com/docs/add-offline-support-with-a-service-worker/
export const onServiceWorkerUpdateReady = () => {
    const answer = window.confirm(
        'AGE Online has been updated. Reload to display the latest version?',
    );
    if (answer === true) {
        window.location.reload();
    }
};
