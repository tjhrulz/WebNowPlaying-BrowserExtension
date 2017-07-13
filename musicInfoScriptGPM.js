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
	ws.send("PLAYER:Google Play Music");
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
		var a = document.getElementById("player-bar-play-pause");
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "next") {
		var a = document.getElementsByClassName("material-player-middle")[0].children[4];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "previous") {
		var a = document.getElementsByClassName("material-player-middle")[0].children[2];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase().includes("setposition ")) {
		var position = event.data.toLowerCase();
		//+9 because "position " is 9 chars
		position = parseInt(position.substring(position.indexOf("position ") + 9));

		document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].currentTime = position;
	}
	else if (event.data.toLowerCase().includes("setvolume ")) {
		var volume = event.data.toLowerCase();
		//+7 because "volume " is 7 chars
		volume = parseInt(volume.substring(volume.indexOf("volume ") + 7)) / 100;
		if (volume > 1) {
			volume = 1;
		}
		else if (volume < 0) {
			volume = 0;
		}

		document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].volume = volume;
	}
	else if (event.data.toLowerCase() == "repeat") {
		var a = document.getElementsByClassName("material-player-middle")[0].children[1];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "shuffle") {
		var a = document.getElementsByClassName("material-player-middle")[0].children[5];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "togglethumbsdown") {
		var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[1];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));

		if (rating > 3) {
			if (!document.getElementsByClassName("rating-container materialThumbs")[0].children[0].title.includes("Undo")) {

				var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
		}
		else if (rating < 3) {
			if (!document.getElementsByClassName("rating-container materialThumbs")[0].children[1].title.includes("Undo")) {

				var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[1];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
		}
		else {
			if (document.getElementsByClassName("rating-container materialThumbs")[0].children[0].title.includes("Undo")) {

				var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
			else if (document.getElementsByClassName("rating-container materialThumbs")[0].children[1].title.includes("Undo")) {

				var a = document.getElementsByClassName("rating-container materialThumbs")[0].children[1];
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
		if (document.getElementById("currently-playing-title") !== null && document.getElementById("currently-playing-title").innerText.length > 0) {
			var newTitle = document.getElementById("currently-playing-title").innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.getElementById("player-artist").innerText;
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			var newAlbum = document.getElementsByClassName("player-album")[0].innerText;
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum);
			}

			var newAlbumArt = document.getElementById("playerBarArt").src;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + newAlbumArt.replace("=s90-c-e100", ""));
			}

			var newDur = document.getElementById("time_container_duration").innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = parseInt(document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].currentTime / 60) + ":" + pad(parseInt(document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].currentTime) % 60, 2);
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].volume * 100;
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + newVolume);
			}

			var thumbsUp = document.getElementsByClassName("rating-container materialThumbs")[0].children[0].title;
			var thumbsDown = document.getElementsByClassName("rating-container materialThumbs")[0].children[1].title;
			var newLiked = thumbsUp + thumbsDown;
			if (newLiked != oldLiked) {
				oldLiked = newLiked;
				var rating = 0;
				if (thumbsUp.includes("Undo")) {
					rating = 5;
				}
				else if (thumbsDown.includes("Undo")) {
					rating = 1;
				}
				ws.send("RATING:" + rating);
			}

			var newRepeat = document.getElementsByClassName("material-player-middle")[0].children[1].title;
			if (newRepeat != oldRepeat) {
				oldRepeat = newRepeat;
				var repeat = 0;

				if (newRepeat.includes("Current")) {
					repeat = 1;
				}
				else if (newRepeat.includes("All")) {
					repeat = 2;
				}
				ws.send("REPEAT:" + repeat);
			}

			var newShuffle = document.getElementsByClassName("material-player-middle")[0].children[5].title;
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				var Shuffle = 0;

				if (newShuffle.includes("off")) {
					Shuffle = 1;
				}
				ws.send("SHUFFLE:" + Shuffle);
			}

			var newState = document.getElementById("player-bar-play-pause").title;
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
