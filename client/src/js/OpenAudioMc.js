import "@babel/polyfill";

import {EnableDebugMode} from './debug'
import {TimeService} from "./modules/socket/TimeService";
import {UserInterfaceModule} from "./modules/ui/UserInterfaceModule";
import {HueModule} from "./modules/hue/HueModule";
import {MediaManager} from "./modules/media/MediaManager";
import {SocketModule} from "./modules/socket/SocketModule";
import {Handlers} from "./modules/socket/Handlers";
import {HueConfigurationModule} from "./modules/hue/HueConfigurationModule";
import {Getters} from "./helpers/utils/Getters";
import {SocketDirector} from "./modules/socket/SocketDirector";
import {NotificationModule} from "./modules/notifications/NotificationModule";
import ClientTokenSet from "./helpers/libs/ClientTokenSet";
import {getHueInstance} from "./helpers/libs/JsHue";
import {linkBootListeners, setLoaderText} from "./helpers/utils/StaticFunctions";
import {WorldModule} from "./modules/world/WorldModule";
import {ReportError} from "./helpers/protocol/ErrorReporter";
import {API_ENDPOINT} from "./helpers/protocol/ApiEndpoints";
import {VoiceModule} from "./modules/voice/VoiceModule";
import {oalog} from "./helpers/log";
import {DebugPanel, WhenDebugging} from "./debug";
import {propertyValueCache, replaceGlobalText, replaceProperty, textElementCache} from "./helpers/domhelper";
import {MessageModule} from "./modules/messages/MessageModule";
import {SettingsManager} from "./modules/settings/SettingsManager";
import {StreamerLink} from "./modules/streamerlink/StreamerLink";

import axios from 'axios';
import {getPhotos} from "./modules/photos/photos-core";

let shittyTokenSet = null;
export const OpenAudioEnv = {
    "build": "__BUILD_VERSION__",
    "compiler": "__BUILD_AUTHOR__",
    "platform": "__BUILD_PLATFORM__",
    "environment": "__BUILD_ENV_RD__",
    "isProd": JSON.parse("__BUILD_IS_PROD__"),
    "envDescription": "__ENV_ABOUT__"
}

window.debugHooks = {};

// debug registry to check for components
WhenDebugging(() => {
    // add debug panel for UI components
    window.debugUi.addPanel(DebugPanel.UI, () => "componentElementCache=" + Object.keys(textElementCache).length + ", propertyCache=" + Object.keys(propertyValueCache).length)
})

export class OpenAudioMc extends Getters {

    constructor(testingMode = false) {
        super();
        oalog("Starting build " + JSON.stringify(OpenAudioEnv))

        this.messageModule = new MessageModule();
        this.isTesting = testingMode;

        this.canStart = false;
        this.host = null;
        this.background = null;
        this.ambianceSound = "";
        this.directorFinished = false;

        this.isPatreon = false;
        this.tokenSet = new ClientTokenSet().fromCache();
        if (this.tokenSet == null) {
            oalog("Stopping with bad auth")
            return;
        }

        //console.log("[DCR] OpenAudioMC.js this.tokenset 68 = " + JSON.stringify(this.tokenSet, null, 4));

        oalog("Resuming boot")

        shittyTokenSet = this.tokenSet;

        this.notificationModule = new NotificationModule(this);
        this.timeService = new TimeService();
        this.userInterfaceModule = new UserInterfaceModule(this);
        this.hueConfiguration = new HueConfigurationModule(this);
        this.mediaManager = new MediaManager(this);
        this.voiceModule = new VoiceModule(this);
        this.streamerLink = new StreamerLink(this);

        setLoaderText("preparing session, welcome " + this.tokenSet.name)

        // request a socket service, then do the booting
        oalog("Setting direcot")
        this.director = new SocketDirector(API_ENDPOINT.MAIN_BACKEND);
        oalog("Calling route")
        this.director.route(this)
            .then(async (res) => {
               // console.log('[DCR] OpenAudioMC.js = ' + JSON.stringify(res, null, 4));

                // load default language
                setLoaderText("Loading language, welcome " + this.tokenSet.name)

                await this.messageModule.load("en.lang");

                if ("Notification" in window) {
                    this.notificationModule.setupPermissions();
                }

                this.hueModule = new HueModule(this, getHueInstance());

                this.settingsManager = new SettingsManager(this);

                // set static shit
                this.messageModule.seedStatic([
                    ["%player", this.tokenSet.name],
                    ["%server", res.serverName]
                ]);

                if (res.useTranslations) {
                    oalog("Enabling automatic translations")
                    try {
                        await this.messageModule.handleCountry(new Intl.Locale(navigator.language).language)
                    } catch (e) {
                        console.error("Failed to load translations ", e)
                    }
                }

                this.serverName = res.serverName;
                this.canStart = true;
                this.host = res.host;
                this.background = res.background;
                this.ambianceSound = res.ambianceSound;
                this.isPatreon = res.isPatreon;
                oalog("Server: " + res.serverName)

                WhenDebugging(() => {
                    window.debugUi.addPanel(DebugPanel.ACCOUNT, "cached=" + res.fromCache + ", pc=" + res.playerCount + ", claimed=" + res.claimed + ", sfu=" + res.host + ", rtc=" + res.rtc)
                });

                let presetVolume = Cookies.get("volume");
                if (presetVolume != null) {
                    this.mediaManager.changeVolume(presetVolume);
                } else {
                    this.mediaManager.changeVolume(25);
                }

                if (this.isPatreon) {
                    oalog("This server is supporting the project on Patreon! that's awesome!")
                    document.getElementById("premium-pill").style.display = "";
                } else {
                    document.getElementById("free-pill").style.display = "";
                }

                // update dom
                replaceGlobalText("{{ craftmend.account.serverName }}", res.serverName)
                // wat a tiny bit, then show
                setTimeout(() => {
                    replaceProperty("{{ oam.loader_style }}", "display: none;", "style")
                }, 250)
                this.directorFinished = true;
            })
            .catch((error) => {
                console.error(error);
                if (!this.isTesting) {
                    this.userInterfaceModule.kickScreen("Your current URL appears to be invalid. Please request a new one in-game using the /audio command. If this issue if persists please contact a member of staff.")
                }
                this.directorFinished = true;
            });
    }

    showLoginScreen() {
        replaceProperty("{{ oam.loader_style }}", "display: -;", "style")
        replaceProperty("{{ oam.login_style }}", "display: -;", "style")
    }

    async start() {
        if (!this.canStart && !this.isTesting) return;
        this.canStart = false;

        this.world = new WorldModule(this);
        this.socketModule = new SocketModule(this, this.host);

        await this.mediaManager.setupAmbianceSound(this.ambianceSound);

        this.mediaManager.postBoot()

        // setup packet handler
        new Handlers(this);
        if (this.background !== "") {
            // update placeholder again
            replaceProperty("{{ oam.side_image }}", this.background)
            replaceProperty("{{ oam.bg_image_map }}", "--bg-map:url('" + this.background + "');")
        }

        this.mediaManager.postBoot();
    }

    sendError(message) {
        ReportError(message, this.tokenSet.name);
    }
}

setLoaderText("Client aan het laden....")
window.onload = linkBootListeners;
window.onhashchange = () => window.location.reload();


if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });

export function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//making this shit universal.
export function getTokenSet() {
    return shittyTokenSet;
}
