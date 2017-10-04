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
	ws.send("PLAYER:DI.FM");
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
			(document.querySelector(".track-region .controls .ico.icon-play") || document.querySelector(".track-region .controls .ico.icon-pause")).click();
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
		if (document.querySelector(".track-region .status") == null) {
			var newTitle = document.querySelector(".track-region .track-name").innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.querySelector(".track-region .artist-name").innerText.replace(' - ', '');
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			//This should be the catagory it is in or publisher
			var newAlbum = document.querySelector(".track-region .channel-name").innerText;
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum);
			}

			//I was only able to reverse engineer the posters not the banners
			var newAlbumArt = document.querySelector(".context-region .artwork img").src;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + oldAlbumArt);
			}

			var newDur = document.querySelector(".track-region .timecode .total").innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.querySelector(".track-region .timecode .time").innerText;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = parseInt(document.querySelector(".settings-region .volume-region .handle").style.left);
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + newVolume);
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