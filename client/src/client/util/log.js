/**
 * Logs a message to the console, if the site is running on localhost. Default type is 0 (Info), **4+ defaults to 0.**
 *
 * **TYPES:**
 *
 * *0* - Info (log) (default),
 *
 * *1* - Warning,
 *
 * *2* - Error,
 *
 * *3* - Dir (objects),
 *
 * *4* - Log (no prefix),
 *
 * @param {*} log What to log,
 * @param {number} type The type of log, default is 0 (Info)
 * @param {string} prefix Optional prefix, default is "[DCRAudio] ", only used if type is not 4
 */
export function dcrlog(log, type = 0, prefix = "[DCRAudio] ") {
    // Shitty ah check but who cares
    //check if site is running on localhost
    if (window.location.hostname.includes("localhost")) {
        switch (type) {
            default:
            case 0:
                console.log(prefix, log);
                break;
            case 1:
                console.warn(prefix, log);git merge upstream/master
                break;
            case 2:
                console.error(prefix, log);
                break;
            case 3:
                console.dir(prefix, log);
                break;
            case 4:
                console.log(log);
        }
    }
}