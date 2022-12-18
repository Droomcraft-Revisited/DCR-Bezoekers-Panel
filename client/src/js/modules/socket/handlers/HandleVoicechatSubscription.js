export function HandleVoiceChatSubscription(openAudioMc, data) {
    console.log('[DCR] HandleVoiceChatSubscription.js 1 = ' + JSON.stringify(data, null, 4))
    openAudioMc.voiceModule.addPeer(data.targetUuid, data.targetPlayerName, data.targetStreamKey, data.location);
}
