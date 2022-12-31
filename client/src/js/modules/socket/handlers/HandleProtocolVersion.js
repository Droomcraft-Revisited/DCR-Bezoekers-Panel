import {oalog} from "../../../helpers/log";
import {API_ENDPOINT} from "../../../helpers/protocol/ApiEndpoints";
import {getTokenSet, waitForElm} from "../../../OpenAudioMc"

export function handleProtocolVersion(openAudioMc, data) {
    const revision = parseInt(data.protocolRevision);

    waitForElm('#dcr-photos').then((elm) => {
        //console.log('Element found', elm);
        //console.log("DCR => BEFORE IFRAME");
        let photos_iframe = window.document.getElementById("dcr-photos");

        let tokenSet = getTokenSet();
        console.log("DCR => TOKENSET = " + JSON.stringify(tokenSet, null, 4));

        if (API_ENDPOINT.DCR_PHOTOS.slice(-1) === "/") {
            photos_iframe.src = API_ENDPOINT.DCR_PHOTOS + tokenSet.uuid;
        } else photos_iframe.src = API_ENDPOINT.DCR_PHOTOS + "/" + tokenSet.uuid;

        photos_iframe.style.display = "block";

        setInterval(function () {
            //refresh iframe
            console.log("DCR => REFRESHING PHOTOS");
            photos_iframe.src = photos_iframe.src;
        }, 5000);

        //console.log("DCR => AFTER IFRAME");
        //console.log(elm.textContent);
    });

    oalog("Received PROTOCOL revision update");
    if (revision >= 2) {
        // enable callbacks
        oalog("PROTO rev => 2, enabling callbacks");
        openAudioMc.socketModule.callbacksEnabled = true;
    }

    if (revision >= 3) {
        // enable callbacks
        oalog("PROTO rev => 3, enabling youtube callbacks");
        openAudioMc.socketModule.supportsYoutube = true;
    }

    if (revision >= 4) {
        // enable volume updates
        oalog("PROTO rev => 4, enabling volume callbacks");
        openAudioMc.mediaManager.startVolumeWatcher(openAudioMc)
    }

    if (revision >= 5) {
        // enable volume loudness, but this has already been deprecated/scrapped
        // oalog("PROTO rev => 5, enabling loudness callbacks");
        // openAudioMc.voiceModule.loudnessDetectionEnabled = true
    }
}