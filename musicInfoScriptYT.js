var oldTitle;
var oldArtist;
var oldAlbum;
var oldAlbumArt;
var oldPos;
var oldDur;
var oldLiked;
var oldRepeat;
var oldState;

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

		console.log("Opening websocket");
	}
	catch (error) {
		console.log("Error:" + error);
	}
}

var onOpen = function() {
	console.log("Opened websocket");
	connected = true;
	ws.send("PLAYER:YOUTUBE");
	//@TODO Possibly send all know data right away on open
	sendData = setInterval(function() {
		dataCheck();
	}, 500);
};

var onClose = function() {
	console.log("Closed websocket");
	connected = false;
	clearInterval(sendData);
	reconnect = setTimeout(function() {
		open();
	}, 5000);
};

var onMessage = function(event) {
	if (event.data.toLowerCase() == "playpause") {
		var a = document.getElementsByClassName("ytp-play-button")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "next") {
		var a = document.getElementsByClassName("ytp-next-button")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	//Make go to beginning of video if not in playlist
	else if (event.data.toLowerCase() == "previous") {
		var a = document.getElementsByClassName("ytp-prev-button")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (document.getElementsByClassName("yt-playlist-buttons").length > 0) {
		if (event.data.toLowerCase() == "repeat") {
			var a = document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[0];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
		else if (event.data.toLowerCase() == "shuffle") {
			var a = document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[1];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
	}
};

var onError = function(event) {
	if (typeof event.data != 'undefined') {
		console.log("Websocket Error:" + event.data);
	}
};

function dataCheck() {
	try {
		if (window.location.href.indexOf("v=") > 0 && document.getElementsByClassName("ytd-video-primary-info-renderer title").length > 0) {
			var newTitle = document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}


			var newArtist = document.getElementById("owner-name").innerText;
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			if (document.getElementById("playlist").children.length > 0) {
				var newAlbum = document.getElementsByClassName("ytd-playlist-panel-renderer title")[0].innerText;
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum);
				}
			}
			else {
				//Come up with a better fallback album
				var newAlbum = "Youtube";
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum);
				}
			}

			var newAlbumArt = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("ALBUMART:" + "https://i.ytimg.com/vi/" + newAlbumArt + "/hqdefault.jpg?");
			}

			var newDur = document.getElementsByClassName("ytp-time-duration")[0].innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.getElementsByClassName("ytp-time-current")[0].innerText;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			//This is lovely is it not?
			var thumbsUp = document.getElementById("menu-container").children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("aria-pressed");
			var thumbsDown = document.getElementById("menu-container").children[0].children[0].children[0].children[1].children[0].children[0].getAttribute("aria-pressed");

			var newLiked = thumbsUp + thumbsDown;
			if (newLiked != oldLiked) {
				oldLiked = newLiked;
				var rating = 0;
				if (thumbsUp == "true") {
					rating = 5;
				}
				else if (thumbsDown == "true") {
					rating = 1;
				}
				ws.send("RATING:" + rating);
			}

			var newState = document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label");

			if (newState != oldState) {
				oldState = newState;

				ws.send("STATE:" + newState.replace("Play", 2).replace("Pause", 1));
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
	}
}
open();
