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

function pad(number, length) {
	var str = number + "";
	while (str.length < length) {
		str = "0" + str;
	}
	return str;
}

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
	ws.send("PLAYER:Youtube");
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
	if (event.data.toLowerCase() == "playpause") {
		document.getElementsByClassName("ytp-play-button")[0].click();
	}
	else if (event.data.toLowerCase() == "next") {
		document.getElementsByClassName("ytp-next-button")[0].click();
	}
	//Make go to beginning of video if not in playlist
	else if (event.data.toLowerCase() == "previous") {
		//If able to go back
		if (document.getElementsByClassName("ytp-prev-button")[0].getAttribute("aria-disabled") == "false") {
			document.getElementsByClassName("ytp-prev-button")[0];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
		else {
			window.history.back();
		}
	}
	else if (event.data.toLowerCase().includes("setposition ")) {
		var position = event.data.toLowerCase();
		//+9 because "position " is 9 chars
		position = position.substring(position.indexOf("position ") + 9);
		//Goto the : at the end of the command, this command is now a compound command the first half is seconds the second is percent
		position = parseInt(position.substring(0, position.indexOf(":")));

		document.getElementsByClassName("video-stream html5-main-video")[0].currentTime = position;
	}
	else if (event.data.toLowerCase().includes("setvolume ")) {
		var volume = event.data.toLowerCase();
		//+7 because "volume " is 7 chars
		volume = parseInt(volume.substring(volume.indexOf("volume ") + 7)) / 100;

		if (volume > 0) {
			document.getElementsByClassName("video-stream html5-main-video")[0].muted = false;
		}

		document.getElementsByClassName("video-stream html5-main-video")[0].volume = volume;
	}
	else if (document.getElementsByClassName("yt-playlist-buttons").length > 0 && (event.data.toLowerCase() == "repeat" || event.data.toLowerCase() == "shuffle")) {
		if (event.data.toLowerCase() == "repeat") {
			document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[0];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
		else if (event.data.toLowerCase() == "shuffle") {
			document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[1];
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		document.getElementById("menu-container").children[0].children[0].children[0].children[0].click();
	}
	else if (event.data.toLowerCase() == "togglethumbsdown") {
		document.getElementById("menu-container").children[0].children[0].children[0].children[1].click();
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));

		//Still just as lovely
		var thumbsUp = document.getElementById("menu-container").children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("aria-pressed");
		var thumbsDown = document.getElementById("menu-container").children[0].children[0].children[0].children[1].children[0].children[0].getAttribute("aria-pressed");
		if (rating > 3) {
			if (thumbsUp != "true") {

				document.getElementById("menu-container").children[0].children[0].children[0].children[0].click();
			}
		}
		else if (rating < 3) {
			if (thumbsDown != "true") {

				document.getElementById("menu-container").children[0].children[0].children[0].children[1].click();
			}
		}
		else {
			if (thumbsUp == "true") {

				document.getElementById("menu-container").children[0].children[0].children[0].children[0].click();
			}
			else if (thumbsDown == "true") {

				document.getElementById("menu-container").children[0].children[0].children[0].children[1].click();
			}
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

				var newRepeat = document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[0].getAttribute("class").includes("active");
				if (newRepeat != oldRepeat) {
					oldRepeat = newRepeat;
					var repeat = 0;

					if (newRepeat === true) {
						repeat = 2;
					}
					ws.send("REPEAT:" + repeat);
				}

				var newShuffle = document.getElementsByClassName("yt-playlist-buttons")[0].children[0].children[1].getAttribute("class").includes("active");
				if (newShuffle != oldShuffle) {
					oldShuffle = newShuffle;
					var Shuffle = 0;

					if (newShuffle === true) {
						Shuffle = 1;
					}
					ws.send("SHUFFLE:" + Shuffle);
				}

			}
			else {
				//Come up with a better fallback album (Possibly catagory but it is stripped from page when showing less may need to use API)
				var newAlbum = "Youtube";
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum);
				}

				var newRepeat = "0";
				if (newRepeat != oldRepeat) {
					oldRepeat = newRepeat;
					ws.send("REPEAT:" + newRepeat);
				}

				var newShuffle = "0";
				if (newShuffle != oldShuffle) {
					oldShuffle = newShuffle;
					ws.send("SHUFFLE:" + newShuffle);
				}
			}

			var newAlbumArt = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + "https://i.ytimg.com/vi/" + newAlbumArt + "/mqdefault.jpg?");
			}

			var newDur = document.getElementsByClassName("ytp-time-duration")[0].innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = parseInt(document.getElementsByClassName("html5-main-video")[0].currentTime / 60) + ":" + pad(parseInt(document.getElementsByClassName("html5-main-video")[0].currentTime) % 60, 2);
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = document.getElementsByClassName("video-stream html5-main-video")[0].volume * 100;
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + newVolume);
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

			var newState = document.getElementsByClassName("html5-main-video")[0].paused;
			//If playing and some video has been played (If no video has been played the video is "playing" but has not started)
			if (!newState && document.getElementsByClassName("html5-main-video")[0].played.length > 0) {
				newState = 1;
			}
			//Else it is paused or over
			else {
				//Check if button has no title, if it does not it is in replay state
				if (document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === null) {
					newState = 3;
				}
				else {
					newState = 2;
				}
			}

			if (newState != oldState) {
				oldState = newState;

				ws.send("STATE:" + newState);
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
