//Adds support for PlayerFM
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

function setup() {

    const playerInfoHandler = createNewMusicInfo();

    playerInfoHandler.player = function () {
        return "PlayerFM";
    };

    playerInfoHandler.readyCheck = function () {
        return document.getElementsByClassName("current-series-link").length > 0 &&
            document.getElementsByClassName("current-series-link")[0].innerText.length > 0;
    };

    playerInfoHandler.state = function () {
        return document.getElementsByClassName("control pause")[0].style.display === "" ? 1 : 2;
    };

    playerInfoHandler.title = function () {
        return document.getElementsByClassName("current-episode-link")[0].innerText;
    };

    playerInfoHandler.artist = function ()
    {
        return document.getElementsByClassName("current-series-link")[0].innerText;
    };

    playerInfoHandler.cover = function () {
        const coverSmall = document.getElementsByClassName("thumb")[0].children[0].getAttribute("src");
        return coverSmall.replace("128", "256");
    };

    playerInfoHandler.durationString = function () {
        // Player.fm displayes duration as "time remaining" so we have to do some math to find the actual duration
        // for the currently playing media.
        const remainingDuration = document.getElementsByClassName("time-remaining")[0].innerText;
        const currentPosition = document.getElementsByClassName("time-elapsed")[0].innerText;

        const times = [ 0, 0, 0 ]
        const max = times.length

        const a = (currentPosition || '').split(':')
        const b = (remainingDuration || '').split(':')

        // normalize time values
        for (let i = 0; i < max; i++) {
            a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
            b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
        }

        // store time values
        for (let i = 0; i < max; i++) {
            times[i] = a[i] + b[i]
        }

        let hours = times[0]
        let minutes = times[1]
        let seconds = times[2]

        if (seconds >= 60) {
            const m = (seconds / 60) << 0
            minutes += m
            seconds -= 60 * m
        }

        if (minutes >= 60) {
            const h = (minutes / 60) << 0
            hours += h
            minutes -= 60 * h
        }

        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    }

    playerInfoHandler.positionString = function () {
        return document.getElementsByClassName("time-elapsed")[0].innerText;
    }

    const playerEventHandler = createNewMusicEventHandler();

    playerEventHandler.readyCheck = function () {
        return document.getElementsByClassName("current-series-link").length > 0 &&
            document.getElementsByClassName("current-series-link")[0].innerText.length > 0;
    };

    playerEventHandler.playpause = function () {
        if (document.getElementsByClassName("control play")[0].style.display === "none") {
            document.getElementsByClassName("control pause")[0].click();
        } else {
            document.getElementsByClassName("control play")[0].click();
        }
    };

    playerEventHandler.next = function () {
        document.getElementsByClassName("control fast-forward")[0].click();
    };

    playerEventHandler.previous = function () {
        document.getElementsByClassName("control fast-backward")[0].click();
    };

    playerEventHandler.progress = function (progress) {
        const loc = document.getElementsByClassName("progress-base")[0].getBoundingClientRect();
        progress *= loc.width;

        const a = document.getElementsByClassName("progress-base")[0];
        const e = document.createEvent('MouseEvents');
        e.initMouseEvent('mousedown', true, true, window, 1,
            screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
            loc.left + progress, loc.top + loc.height / 2,
            false, false, false, false, 0, null);
        a.dispatchEvent(e);
        e.initMouseEvent('mouseup', true, true, window, 1,
            screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
            loc.left + progress, loc.top + loc.height / 2,
            false, false, false, false, 0, null);
        a.dispatchEvent(e);
    };
}

setup();
init();
