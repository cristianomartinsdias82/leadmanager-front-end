export const userBrowserIsFirefox = () => {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}