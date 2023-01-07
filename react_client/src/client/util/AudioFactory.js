import {AudioSourceProcessor} from "./AudioSourceProcessor";

export let prefetchedSounds = {};
let pro = new AudioSourceProcessor();

export function ClearPrefetchedMedia() {
    prefetchedSounds = {};
}

export async function PreFetch(source) {
    source = await pro.translate(source)
    let soundElement = new Audio();
    soundElement.autoplay = false;
    soundElement.src = source;
    soundElement.load();
    prefetchedSounds[source] = soundElement;
    return soundElement;
}

export async function GetAudio(source, isTranslated = false, allowCaching = true) {
    if (!allowCaching) {
        return new Audio();
    }
    if (!isTranslated) {
        source = await pro.translate(source)
    }
    let loaded = prefetchedSounds[source];
    if (loaded != null) {
        return loaded;
    }
    return new Audio();
}