# DCR Bezoekers panel
[![Build Status](https://travis-ci.org/Mindgamesnl/OpenAudioMc.svg?branch=master)](https://travis-ci.org/Mindgamesnl/OpenAudioMc)
![commit activity](https://img.shields.io/github/commit-activity/4w/mindgamesnl/openaudiomc.svg)
[![Lines of Code](https://img.shields.io/tokei/lines/github/Mindgamesnl/OpenAudioMc)](https://github.com/Mindgamesnl/OpenAudioMc)
[![](https://img.shields.io/github/stars/Mindgamesnl/OpenAudioMc.svg?label=Stars&logo=github)](https://github.com/Mindgamesnl/OpenAudioMc/stargazers)
[![](https://img.shields.io/badge/Paper-1.17.1-brightgreen.svg?colorB=DC3340)](https://papermc.io/downloads)
[![](https://img.shields.io/discord/245497740589662209.svg?color=%237289da&label=Discord&logo=discord&logoColor=%237289da)](https://discord.gg/C4ZZ6u2)
[![](https://img.shields.io/badge/Patreon-Support-orange.svg?logo=Patreon)](https://www.patreon.com/mindgamesnl)

Welkom bij de git repository van het DCR Bezoekers panel. Hierin vind je de code die gebruikt wordt voor het bezoekers panel.
Door ons is alleen de code van de client zelf aangepast. Verder zijn er geen veranderingen aangepast aan de plugin. 
Ook is de build versie in `docs/production-client` niet up to date in de git repository, we hebben er namelijk voor gekozen om deze aan de .gitignore toe te voegen.
Alhoewel je natuurlijk de client zelf kan builden via de instructies hieronder. Voor vragen of opmerkingen kan je terecht op discord: `Timtendo12#2909` of onze e-mail: `Info@droomcraftrevisited.nl`.

## ActionPhoto code?
De source code voor de ActionPhoto bevind zich hier niet, Deze OAM Client haalt alleen data van onze backend server af via de ActionPhoto API. De code van de actionphoto is op dit moment closed source.
**Mocht je een server, developer of code enthiousiast zijn en geinterreseerd te zijn in de code, dan kan je contact opnemen met ons via discord of e-mail. Misschien maken we een uitzondering voor jou**, Alhoewel de code 
inderdaad closed source is om de kwaliteit en orginaliteit in onze versie van de AP te behouden. Ben ik stieken klein beetje van mening dat alle code open source moet zijn ;).
---------------------------------------
# OpenAudioMc

![welcome](https://i.imgur.com/OEvbUQb_d.png?maxwidth=1920&fidelity=grand)

OpenAudioMc is the free Minecraft audio solution, adding unique and impressing features to your server (like music, sound effects, proximity voice chat and more) without any setup on the user side. They just join your server, click one link and are good to go!

Please visit the [Documentation](https://help.openaudiomc.net/docs) for a full getting started/setup guide as well as full feature breakdowns.

## Features
 - Proximity Voice Chat (with spatial and normal audio)
 - Full built-in moderation support
 - Music and sound effects without resource pack
 - Native Worldguard integration to asign music to regions and query for key locations
 - Speaker blocks you can place throughout your world to add audio in special places
 - Built-in TrainCarts hook to adding on-board music for rides
 - LiteBans support to syncronize mutes with voice chat
 - Feature rich java API
 - Easy to use web clients (players receive their own personal link, no downloads or accounts required)
 - Automatic client translation in 9 languages
 - Automatic CDN infrastructure to speed up file delivery without any configuration
 - Out of the box support for Youtube, Soundcloud, Google Drive and Dropbox
 - Amazing documentation
 - Fully configurable
 - Stupidly simple to use
 - Active support and community
 - Smart pre-loading/buffering based on a location learning algorithm
 - Moderation utilities and hooks for voicechat
 - User preferences and client settings
 - Video background support

## Supported platforms
 - [Spigot (1.12 and up, with primitive support for lower versions)](https://www.spigotmc.org/resources/openaudiomc-open-source-audio-client.30691/ "Spigot Plugin Page")
 - [BungeeCord (recent builds)](https://www.spigotmc.org/resources/openaudiomc-open-source-audio-client.30691/ "Spigot Plugin Page")
 - [Velocity](https://www.spigotmc.org/resources/openaudiomc-open-source-audio-client.30691/ "Spigot Plugin Page")

## Notes on testing
The Java plugin/implementation and vistas platforms come bundled with maven unit tests. All tests *must* pass before pull requests can definitively be reviewed.
Please note that the test for `vistas-server` use an embedded Redis server that will be installed on your system. This is known to use up to 20 gigs of storage in Windows and sometimes leaves trailing background processes, so please keep an eye on that if you only wish to build a jar once and don't care about keeping development software on your machine. Tests aren't required to build a functional target, so  you can disable them all together if you want to.

## Useful Links
* **Patreon** - <https://patreon.com/mindgamesnl>
* **Privacy and License** - <https://github.com/Mindgamesnl/OpenAudioMc/blob/master/LICENCE_and_PRIVACY.md>
* **Website** - <http://openaudiomc.net/>
* **Discord Community** - <https://discord.openaudiomc.net/>
* **Documentation** - <http://help.openaudiomc.net/docs>

# Help OpenAudioMc!
OpenAudioMc is a free spigot plugin and we'd like to keep it this way.  But to keep OpenAudioMc up and running, we need to host multiple servers (SocketIO, Web servers and more...) and this is expensive. This is why I've made a [donation page](http://donate.craftmend.com/), everything goes to the hosting for OpenAudioMc. You can also make continues donations on [Patreon](https://patreon.com/mindgamesnl) which also comes with a few extra bonuses.

# Platform setup
The core of OpenAudioMc is written to be independent of platforms, this makes it easier to maintain feature parity and compatibility across multiple platforms (bungeecord, velocity, spigot, etc). This means that some common api's need to be abstracted for internal use, here are a few terms and interfaces you need to know about
### `User` *interface*
A user refers to an actor that interacts with OpenAudioMc. This could be a player, proxy player, commandblock, or whatever. Code should be written so that it doesn't really matter *what* a user is, but you can get the original platform object in edge cases where you need to interact with native API's.
### `Client` *interface*
A `Client` is an interface that exposes some API methods of the `ClientConnection`, a client connection represents the socket API gateway to a web client, and maintains its status, authentication and manages packet throughput.
### `UserHooks` *interface*
A UserHook provider is an interface that should supply `User` instances based on the current environment state or from a query. It's generally used to get a collection of online Users, or get Users by UUID regardless of the platform. UserHooks should also adapt proxy management, and announce local nodes (if any).

# Codebase core terminology
 - **Platform**: refers to the server environment where OpenAudioMc is running, like Bungeecord, Spigot, Velocity and Standalone
 - **Service**: Most of the internal codebase was re-written and refactored during the 6.5.5 update, where we migrated to a custom service manager with support for annotation based dependency injection, service abstraction and to provide pointer safety during reloads.
   The service manager is registered in the main OpenAudioMc class and is accessible through all platforms. The entire ecosystem consists of two main registration types. Services are static code implementations that can be injected, requested and manipulated after loading (or being requested, in which case they’ll be loaded if they weren’t already)
 - **Module**: Modules are jar files with extra content, features or scripts that modify default OpenAudioMc behaviour. Usually used to integrate with third party plugins. 


# Project structure
 - `plugin/` contains the plugin and framework source code
 - `client/` contains the source code, build scripts and assets of the production web client
 - `documentation/` contains the documentation as MD and is compiled to web sources through github pages. The web client and documentation are directly served from master. (Moved to seperate [repo](https://github.com/OpenAudioMc/documentation))
 - `module-src/jutils` contains legacy java libraries that are only used during migrations
 - `module-src/migrator` contains the migrator that converts legacy MapDB database stores to Sqlite through Storm
 - `module-src/parties` contains the module integrating with the official [Parties](https://www.spigotmc.org/resources/parties-an-advanced-parties-manager.3709/) plugin
 - `module-src/skywars` contains the module integrating with native Skywars game states ([Skywars Reloaded](https://github.com/lukasvdgaag/SkyWarsReloaded))
 - `module-src/rinoarc-legacy` contains the commisioned module from Rinoard for legacy 1.8 support
 - `module-src/vistas-server` a standalone OpenAudioMc installation that links over redis, for enterprise deployments with multiple bungee or lilypad proxies
 - `module-src/vistas-client` a plugin runtime implementation for vistas, to hook into a redis based mesh network

### Metrics
[![Stargazers over time](https://starchart.cc/Mindgamesnl/openaudiomc.svg)](https://starchart.cc/Mindgamesnl/openaudiomc)
