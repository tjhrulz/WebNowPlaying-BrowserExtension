var oldTitle = "";
var oldArtist = "";
var oldAlbum = "";
var oldAlbumArt = "";
var oldPos = "";
var oldDur = "";
var oldVolume = "";
var oldLiked = "";
var oldRepeat = "";
var oldShuffle = "";
var oldState = "";

var ws;
var connected = false;
var reconnect;
var sendData;

function open() {
	try {
		var url = "ws://127.0.0.1:8974/";
		ws = new WebSocket(url);
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onmessage = onMessage;
		ws.onerror = onError;

		oldTitle = "";
		oldArtist = "";
		oldAlbum = "";
		oldAlbumArt = "";
		oldPos = "";
		oldDur = "";
		oldVolume = "";
		oldLiked = "";
		oldRepeat = "";
		oldShuffle = "";
		oldState = "";
	}
	catch (error) {
		console.log("Error:" + error);
	}
}

var onOpen = function() {
	connected = true;
	ws.send("PLAYER:Soundcloud");
	//@TODO Possibly send all know data right away on open
	sendData = setInterval(function() {
		dataCheck();
	}, 50);
};

var onClose = function() {
	connected = false;
	clearInterval(sendData);
	reconnect = setTimeout(function() {
		open();
	}, 5000);
};

var onMessage = function(event) {
	try {
		if (event.data.toLowerCase() == "playpause") {

			//Tidal does not unload anything in the page so just check the state before clicking one of the buttons
			//If paused
			if (document.getElementsByClassName("play-controls__main-button--paused").length > 0) {
				//Click play button
				document.getElementsByClassName("play-controls__main-button")[0].children[0].click();
			}
			else {
				//Click pause button
				document.getElementsByClassName("play-controls__main-button")[0].children[1].click();
			}
		}
		else if (event.data.toLowerCase() == "next") {
			document.getElementsByClassName("play-controls__next")[0].click();
		}
		else if (event.data.toLowerCase() == "previous") {
			document.getElementsByClassName("play-controls__previous")[0].click();
		}
		else if (event.data.toLowerCase().includes("setprogress ")) {
			var progress = event.data.toLowerCase();
			//+9 because "position " is 9 chars
			progress = progress.substring(progress.indexOf("progress ") + 9);

			var loc = document.getElementsByClassName("progressbar__interaction-layer")[0].getBoundingClientRect();
			progress = parseFloat(progress.substring(0, progress.indexOf(":"))) * loc.width;

			var a = document.getElementsByClassName("progressbar__interaction-layer")[0];
			var e = document.createEvent('MouseEvents');
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
		}
		else if (event.data.toLowerCase().includes("setvolume ")) {
			var volume = event.data.toLowerCase();
			//+7 because "volume " is 7 chars
			//100- because soundcloud uses verticle bar
			volume = parseInt(volume.substring(volume.indexOf("volume ") + 7));

			var a = document.getElementsByClassName("js-volume-status")[0];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
			var a = document.getElementsByClassName("js-volume-status")[0];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);

			var counter = 0;
			//@TODO reduce time required for this by making it poll until ready
			var volumeReadyTest = setInterval(function() {
				if (document.getElementsByClassName("show-slider").length > 0) {
					clearInterval(volumeReadyTest);
					var loc = document.getElementsByClassName("volume-slider")[0].getBoundingClientRect();
					volume = volume / 100 * loc.height;

					var a = document.getElementsByClassName("volume-slider")[0];
					var e = document.createEvent('MouseEvents');
					//As much as I hate hard coded stuff for some reason the click is always of by 5, no idea where it comes from but it is always exactly 5
					e.initMouseEvent('mousedown', true, true, window, 1,
						screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
						loc.left + loc.width / 2, loc.bottom - volume,
						false, false, false, false, 0, null);
					a.dispatchEvent(e);
					e.initMouseEvent('mouseup', true, true, window, 1,
						screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
						loc.left + loc.width / 2, loc.bottom - volume,
						false, false, false, false, 0, null);
					a.dispatchEvent(e);

					var a = document.getElementsByClassName("js-volume-status")[0];
					var e = document.createEvent('MouseEvents');
					e.initMouseEvent('mouseout', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.dispatchEvent(e);
				}
				else {
					counter++;
					if (counter > 10) {
						clearInterval(volumeReadyTest);
					}
				}
			}, 25);
		}
		else if (event.data.toLowerCase() == "repeat") {
			document.getElementsByClassName("play-controls__repeat")[0].click();
		}
		else if (event.data.toLowerCase() == "shuffle") {
			document.getElementsByClassName("play-controls__shuffle")[0].click();
		}
		else if (event.data.toLowerCase() == "togglethumbsup") {
			document.getElementsByClassName("js-item-action js-favorite")[0].click();
		}
		else if (event.data.toLowerCase().includes("rating ")) {
			var rating = event.data.toLowerCase();
			//+7 because "rating " is 7 chars
			rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));
			var liked = !document.getElementsByClassName("js-item-action js-favorite")[0].innerText.includes("Remove");

			if (rating > 3) {
				if (!liked) {
					document.getElementsByClassName("js-item-action js-favorite")[0].click();
				}
			}
			else {
				if (liked) {
					document.getElementsByClassName("js-item-action js-favorite")[0].click();
				}
			}
		}
	}
	catch (e) {
		ws.send("Error:" + e);
		throw e;
	}
};

var onError = function(event) {
	if (typeof event.data != 'undefined') {
		console.log("Websocket Error:" + event.data);
	}
};

function dataCheck() {
	try {
		if (document.getElementsByClassName("player__heading").length > 0 && document.getElementsByClassName("player__heading")[0].innerText.length > 0) {
			var newTitle = document.getElementsByClassName("player__heading")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.getElementsByClassName("player__links")[0].innerText;
			if (newTitle != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			if (document.getElementsByClassName("info-box__table").length > 0) {
				var newAlbum = document.getElementsByClassName("info-box__table")[0].children[0].children[2].children[1].innerText;
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum.replace("From ", ""));
				}
			}

			var newAlbumArt = document.getElementsByClassName("js-footer-player-image")[0].src;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + newAlbumArt.replace("320x320", "1280x1280"));
			}

			var newDur = document.getElementsByClassName("player__elapsed-time__duration")[0].innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.getElementsByClassName("player__elapsed-time__progress")[0].innerText;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = parseInt(document.getElementsByClassName("ui-slider-handle")[0].style.bottom);
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + newVolume);
			}

			if (document.getElementsByClassName("js-item-action js-favorite").length > 0) {
				var newLiked = document.getElementsByClassName("js-item-action js-favorite")[0].innerText.includes("Remove");
				if (newLiked != oldLiked) {
					oldLiked = newLiked;
					if (newLiked) {
						ws.send("RATING:" + 5);
					}
					else {
						ws.send("RATING:" + 0);
					}
				}
			}
			else {
				document.getElementsByClassName("js-context-menu-button")[0].click();
				setTimeout(function() {
					document.getElementsByClassName("js-context-menu-button")[0].click();
				}, 50);
			}

			var newRepeat = 0;
			if (document.getElementsByClassName("play-controls__repeat active").length > 0) {
				if (document.getElementsByClassName("icon-Playback_repeatOnce").length > 0) {
					newRepeat = 1;
				}
				else {
					newRepeat = 2;
				}
			}
			if (newRepeat != oldRepeat) {
				oldRepeat = newRepeat;
				ws.send("REPEAT:" + newRepeat);
			}

			var newShuffle = document.getElementsByClassName("play-controls__shuffle active").length;
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				if (newShuffle > 0) {
					ws.send("SHUFFLE:" + 1);
				}
				else {
					ws.send("SHUFFLE:" + 0);
				}
			}

			var newState = document.getElementsByClassName("play-controls__main-button--paused").length;
			if (newState != oldState) {
				oldState = newState;
				if (newState > 0) {
					ws.send("STATE:" + 2);
				}
				else {
					ws.send("STATE:" + 1);
				}
			}
		}
		else {
			//@TODO Decide on if/how to tell it to reset data/ignore this one
			//Send playback as stopped
			var newState = 0;
			if (newState != oldState) {
				oldState = newState;
				ws.send("STATE:" + newState);
			}
		}
	}
	catch (e) {
		ws.send("Error:" + e);
		throw e;
	}
}
open();
