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
var oldAlbumID = "";

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
		oldAlbumID = "";
	}
	catch (error) {
		console.log("Error:" + error);
	}
}

var onOpen = function() {
	connected = true;
	ws.send("PLAYER:Spotify");
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
		document.getElementsByClassName("player-controls__buttons")[0].children[2].click();
	}
	else if (event.data.toLowerCase() == "next") {
		document.getElementsByClassName("spoticon-skip-forward-16")[0].click();
	}
	else if (event.data.toLowerCase() == "previous") {
		document.getElementsByClassName("spoticon-skip-back-16")[0].click();
	}
	else if (event.data.toLowerCase().includes("setprogress ")) {
		var progress = event.data.toLowerCase();
		//+9 because "position " is 9 chars
		progress = progress.substring(progress.indexOf("progress ") + 9);

		var loc = document.getElementsByClassName("playback-bar")[0].children[1].getBoundingClientRect();
		progress = parseFloat(progress.substring(0, progress.indexOf(":")))* loc.width;

    var a = document.getElementsByClassName("playback-bar")[0].children[1];
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
		volume = parseInt(volume.substring(volume.indexOf("volume ") + 7));

		var loc = document.getElementsByClassName("volume-bar")[0].children[1].getBoundingClientRect();
		volume = volume / 100 * loc.width;

    var a = document.getElementsByClassName("volume-bar")[0].children[1];
    var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + volume, screenY + loc.top + loc.height / 2,
			loc.left + volume, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
    a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + volume, screenY + loc.top + loc.height / 2,
			loc.left + volume, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
    a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "repeat") {
		if (document.getElementsByClassName("spoticon-repeat-16").length > 0) {
			 document.getElementsByClassName("spoticon-repeat-16")[0].click();
		}
	}
	else if (event.data.toLowerCase() == "shuffle") {
		if (document.getElementsByClassName("spoticon-shuffle-16").length > 0) {
			 document.getElementsByClassName("spoticon-shuffle-16")[0].click();
		}
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		if (document.getElementsByClassName("spoticon-heart-16").length > 0) {
			document.getElementsByClassName("spoticon-heart-16")[0].click();
		}
		else if (document.getElementsByClassName("spoticon-add-16").length > 0) {
			document.getElementsByClassName("spoticon-add-16")[0].click();
		}
	}
	else if (event.data.toLowerCase() == "togglethumbsdown") {
		if (document.getElementsByClassName("spoticon-ban-16").length > 0) {
			document.getElementsByClassName("spoticon-ban-16")[0].click();
		}
		else if (document.getElementsByClassName("spoticon-added-16").length > 0) {
			document.getElementsByClassName("spoticon-added-16")[0].click();
		}
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));

		if (rating > 3) {
			if (document.getElementsByClassName("spoticon-heart-16").length > 0) {
				document.getElementsByClassName("spoticon-heart-16")[0].click();
			}
			else if (document.getElementsByClassName("spoticon-add-16").length > 0) {
				document.getElementsByClassName("spoticon-add-16")[0].click();
			}
		}
		else if (rating < 3) {
			if (document.getElementsByClassName("spoticon-ban-16").length > 0) {
				document.getElementsByClassName("spoticon-ban-16")[0].click();
			}
			else if (document.getElementsByClassName("spoticon-added-16").length > 0) {
				document.getElementsByClassName("spoticon-added-16")[0].click();
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
		if (document.getElementsByClassName("track-info__name").length > 0 && document.getElementsByClassName("track-info__name")[0].innerText.length > 0) {
			var newTitle = document.getElementsByClassName("track-info__name")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.getElementsByClassName("track-info__artists")[0].innerText;
			if (newTitle != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			//Album, Albumart are done on the plugin side using the API these are just failsafes
			var newAlbum = document.getElementsByClassName("react-contextmenu-wrapper")[0].children[0].children[0].title;
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum.replace("Playing from ", ""));
			}

			var newAlbumArt = document.getElementsByClassName("cover-art-image")[document.getElementsByClassName("cover-art-image").length - 1].style.backgroundImage;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				//Replace 50x50 and 120x120 just incase we ended up with a user image
				ws.send("COVER:" + newAlbumArt.substring(newAlbumArt.indexOf("(") + 2, newAlbumArt.indexOf(")") - 1));
			}

			var newDur = document.getElementsByClassName("playback-bar__progress-time")[1].innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.getElementsByClassName("playback-bar__progress-time")[0].innerText;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			var newVolume = document.getElementsByClassName("progress-bar__fg")[1].style.width;
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + parseFloat(newVolume));
			}

			var newLiked = document.getElementsByClassName("spoticon-heart-16").length;
			if (newLiked === 0) {
				if (document.getElementsByClassName("spoticon-heart-active-16").length === 0) {
					newLiked = document.getElementsByClassName("spoticon-add-16").length;
				}
			}
			if (newLiked != oldLiked) {
				oldLiked = newLiked;

				if (newLiked == 1) {
					ws.send("RATING: 0");
				}
				else {
					ws.send("RATING: 5");
				}
			}

			var newRepeat = 0;
			if (document.getElementsByClassName("spoticon-repeat-16").length > 0) {
				newRepeat = document.getElementsByClassName("spoticon-repeat-16")[0].title;
			}
			if (newRepeat != oldRepeat) {
				oldRepeat = newRepeat;
				ws.send("REPEAT:" + newRepeat.replace("Enable repeat", 0).replace("Disable repeat", 2));
			}

			//If shuffle is not on page it is in radio mode
			var newShuffle = 1;
			if (document.getElementsByClassName("spoticon-shuffle-16").length) {
				newShuffle = document.getElementsByClassName("spoticon-shuffle-16")[0].title;
			}
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				ws.send("SHUFFLE:" + newRepeat.replace("Enable shuffle", 0).replace("Disable shuffle", 1));
			}

			var newState = document.getElementsByClassName("spoticon-play-16").length + 1;
			if (newState != oldState) {
				oldState = newState;
				ws.send("STATE:" + newState);
			}


			var newAlbumID = document.getElementsByClassName("track-info__name")[0].children[0].children[0].href;
			if (newAlbumID != oldAlbumID) {
				oldAlbumID = newAlbumID;
				ws.send("AlbumID:" + newAlbumID);
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
