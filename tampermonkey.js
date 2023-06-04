// ==UserScript==
// @name         Youtube Media Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Next and previous media controls for non-playlist playback
// @author       https://github.com/FerryHuisman
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @icon         https://www.youtube.com/s/desktop/b182fc95/img/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function IsPlaylist()
    {
        let url = new URL(window.location.href)
        let list = url.searchParams.get("list")
        return typeof(list) == "string"
    }

    function ClickElementsByClassname(className)
    {
        let elements = document.getElementsByClassName(className)
        for (let i = 0; i < elements.length; i++)
        {
            let element = elements.item(i)
            element.click()
        }
    }

    let hooks = 
    {
        'previoustrack': () => ClickElementsByClassname("ytp-prev-button"),
        'nexttrack': () => ClickElementsByClassname("ytp-next-button"),
    }

    let setActionHandler = window.navigator.mediaSession.setActionHandler.bind(window.navigator.mediaSession)
    window.navigator.mediaSession.setActionHandler = function(name, callback)
    {
        let hook = hooks[name]
        if (hook && !IsPlaylist())
        {
            console.log("mediaSession.setActionHandler hook:", callback, " -> ", hook)
            callback = hook
        }
        setActionHandler(name, callback)
    }
})();