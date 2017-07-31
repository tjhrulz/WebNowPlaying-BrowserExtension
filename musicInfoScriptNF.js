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
	try {
		if (event.data.toLowerCase() == "playpause") {
			document.getElementsByClassName("player-play-pause")[0].click();
		}
		//Possibly add back next support when movie/show is over (There is two different cases or netflix changed the look of that)
		else if (event.data.toLowerCase().includes("setposition ")) {
			var position = event.data.toLowerCase();
			//+9 because "position " is 9 chars
			position = position.substring(position.indexOf("position ") + 9);
			//Goto the : at the end of the command, this command is now a compound command the first half is seconds the second is percent
			position = parseInt(position.substring(0, position.indexOf(":")));

			document.getElementsByTagName('video')[0] = position;
		}
		else if (event.data.toLowerCase().includes("setvolume ")) {
			var volume = event.data.toLowerCase();
			//+7 because "volume " is 7 chars
			volume = parseInt(volume.substring(volume.indexOf("volume ") + 7)) / 100;

			if (volume > 0) {
				document.getElementsByTagName('video')[0].muted = false;
			}

			document.getElementsByTagName('video')[0].volume = volume;
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
		if (document.getElementsByClassName("player-status-main-title").length > 0) {
			var newTitle = document.getElementsByClassName("player-status-main-title")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			//Possibly use https://netflixroulette.net/api/
			//Get director
			var newArtist = "Netflix";
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			//This should be the catagory it is in or publisher
			var newAlbum = "Netflix";
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum);
			}

			//I was only able to reverse engineer the posters not the banners
			var newAlbumArt = window.location.href.substring(window.location.href.indexOf("/watch/") + 7, window.location.href.indexOf("?trackId"));
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + "http://cdn-2.nflximg.com//en_us//boxshots//ghd//" + newAlbumArt + ".jpg");
			}

			var newDur = parseInt(document.getElementsByTagName('video')[0].duration / 60) + ":" + pad(parseInt(document.getElementsByTagName('video')[0].duration) % 60, 2);
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = parseInt(document.getElementsByTagName('video')[0].currentTime / 60) + ":" + pad(parseInt(document.getElementsByTagName('video')[0].currentTime) % 60, 2);
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = document.getElementsByTagName('video')[0].volume * 100;
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + newVolume);
			}

			//Possibly add back rating support when movie is over

			var newState = document.getElementsByTagName('video')[0].paused;
			if (!newState) {
				newState = 1;
			}
			else {
				newState = 2;
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
