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
	if (event.data.toLowerCase() == "playpause") {
		var a = document.getElementsByClassName("playControl")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "next") {
		var a = document.getElementsByClassName("skipControl__next")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "previous") {
		var a = document.getElementsByClassName("skipControl__previous")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "repeat") {
		var a = document.getElementsByClassName("repeatControl")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		var a = document.getElementsByClassName("playbackSoundBadge__like")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));
		var liked = !document.getElementsByClassName("playbackSoundBadge__like")[0].title.includes("Unlike");

		if (rating > 3) {
			if (!liked) {
				var a = document.getElementsByClassName("playbackSoundBadge__like")[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
		}
		else {
			if (liked) {
				var a = document.getElementsByClassName("playbackSoundBadge__like")[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
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
		if (document.getElementsByClassName("playbackSoundBadge__title").length > 0) {
			var newTitle = document.getElementsByClassName("playbackSoundBadge__titleLink")[0].title;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			if (document.getElementsByClassName("playControl")[0].title == "Pause current") {
				var newArtist = document.title.substring(document.title.indexOf("by") + 3).replace(" | Free Listening on SoundCloud");
				if (newArtist != oldArtist) {
					oldArtist = newArtist;
					ws.send("ARTIST:" + newArtist);
				}
			}

			var newAlbum = document.getElementsByClassName("playbackSoundBadge__context")[0].innerText;
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum.replace("Playing from ", ""));
			}

			var newAlbumArt = document.getElementsByClassName("sc-artwork")[document.getElementsByClassName("sc-artwork").length - 1].style.backgroundImage;
			if (newAlbumArt.includes("avatar")) {
				newAlbumArt = document.getElementsByClassName("sc-artwork")[document.getElementsByClassName("sc-artwork").length - 3].style.backgroundImage;
			}
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + newAlbumArt.substring(newAlbumArt.indexOf("(") + 2, newAlbumArt.indexOf(")") - 1).replace("50x50", "500x500"));
			}

			var newDur = document.getElementsByClassName("playbackTimeline__duration")[0].children[1].innerHTML;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.getElementsByClassName("playbackTimeline__timePassed")[0].children[1].innerHTML;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = document.getElementsByClassName("volume__sliderWrapper")[0].getAttribute("aria-valuenow");
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + parseFloat(newVolume) * 100);
			}

			var newLiked = document.getElementsByClassName("playbackSoundBadge__like")[0].title;
			if (newLiked != oldLiked) {
				oldLiked = newLiked;
				ws.send("RATING:" + newLiked.replace("Unlike", 5).replace("Like", 0));
			}

			var newRepeat = document.getElementsByClassName("repeatControl sc-ir m-old m-one").length;
			if (newRepeat != oldRepeat) {
				oldRepeat = newRepeat;
				ws.send("REPEAT:" + newRepeat);
			}

			var newState = document.getElementsByClassName("playControl")[0].title;
			if (newState != oldState) {
				oldState = newState;
				ws.send("STATE:" + newState.replace("Play current", 2).replace("Pause current", 1));
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
