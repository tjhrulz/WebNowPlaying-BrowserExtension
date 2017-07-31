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
		document.getElementsByClassName("playControl")[0].click();
	}
	else if (event.data.toLowerCase() == "next") {
		document.getElementsByClassName("skipControl__next")[0].click();
	}
	else if (event.data.toLowerCase() == "previous") {
		document.getElementsByClassName("skipControl__previous")[0].click();
	}
	else if (event.data.toLowerCase().includes("setprogress ")) {
		var progress = event.data.toLowerCase();
		//+9 because "position " is 9 chars
		progress = progress.substring(progress.indexOf("progress ") + 9);

		var loc = document.getElementsByClassName("playbackTimeline__progressWrapper")[0].getBoundingClientRect();
		progress = parseFloat(progress.substring(0, progress.indexOf(":"))) * loc.width;

		var a = document.getElementsByClassName("playbackTimeline__progressWrapper")[0];
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

		var a = document.getElementsByClassName("volume")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		var a = document.getElementsByClassName("volume")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);

		var counter = 0;
		//@TODO reduce time required for this by making it poll until ready
		var volumeReadyTest = setInterval(function() {
			if (document.getElementsByClassName("volume expanded hover").length > 0) {
				clearInterval(volumeReadyTest);
				var loc = document.getElementsByClassName("volume__sliderBackground")[0].getBoundingClientRect();
				volume = volume / 100 * loc.height;

				var a = document.getElementsByClassName("volume__sliderBackground")[0];
				var e = document.createEvent('MouseEvents');
				//As much as I hate hard coded stuff for some reason the click is always of by 5, no idea where it comes from but it is always exactly 5
				e.initMouseEvent('mousedown', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume +5,
					loc.left + loc.width / 2, loc.bottom - volume +5,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);
				e.initMouseEvent('mouseup', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume +5,
					loc.left + loc.width / 2, loc.bottom - volume +5,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);

				var a = document.getElementsByClassName("volume")[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('mouseout', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
			else {
				counter++;
					if(counter > 10)
					{
						clearInterval(volumeReadyTest);
					}
			}
		}, 25);
	}
	else if (event.data.toLowerCase() == "repeat") {
		document.getElementsByClassName("repeatControl")[0].click();
	}
	else if (event.data.toLowerCase() == "shuffle") {
		document.getElementsByClassName("shuffleControl")[0].click();
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		document.getElementsByClassName("playbackSoundBadge__like")[0].click();
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));
		var liked = !document.getElementsByClassName("playbackSoundBadge__like")[0].title.includes("Unlike");

		if (rating > 3) {
			if (!liked) {
				document.getElementsByClassName("playbackSoundBadge__like")[0].click();
			}
		}
		else {
			if (liked) {
				document.getElementsByClassName("playbackSoundBadge__like")[0].click();
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

			var newArtist = document.getElementsByClassName("playbackSoundBadge__lightLink")[0].innerText;
			if (newTitle != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			if (document.getElementsByClassName("queueItemView m-playing m-active").length > 0) {
				var newAlbum = document.getElementsByClassName("queueItemView m-playing m-active")[0].children[2].children[0].children[1].title;
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum.replace("From ", ""));
				}
			}
			//No else because otherwise we would lose info when playback is stopped, maybe I could move it below state check in the future though

			var newAlbumArt = document.getElementsByClassName("sc-artwork")[document.getElementsByClassName("sc-artwork").length - 1].style.backgroundImage;
			//If it includes 50x50 then it is the album art and not a user profile image
			if (!newAlbumArt.includes("50x50")) {
				newAlbumArt = document.getElementsByClassName("sc-artwork")[document.getElementsByClassName("sc-artwork").length - 3].style.backgroundImage;
			}
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				//Replace 50x50 and 120x120 just incase we ended up with a user image
				ws.send("COVER:" + newAlbumArt.substring(newAlbumArt.indexOf("(") + 2, newAlbumArt.indexOf(")") - 1).replace("50x50", "500x500").replace("120x120", "500x500"));
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

			var newVolume = parseInt(document.getElementsByClassName("volume__sliderProgress")[0].style.height);
			if (newVolume != oldVolume) {
				oldVolume = newVolume;

				ws.send("VOLUME:" + 100 * newVolume / document.getElementsByClassName("volume__sliderBackground")[0].getBoundingClientRect().height);
			}

			var newLiked = document.getElementsByClassName("playbackSoundBadge__like")[0].title;
			if (newLiked != oldLiked) {
				oldLiked = newLiked;
				ws.send("RATING:" + newLiked.replace("Unlike", 5).replace("Like", 0));
			}

			var repeatOne = document.getElementsByClassName("m-one").length;
			var repeatNone = document.getElementsByClassName("m-none").length;
			var repeatAll = document.getElementsByClassName("m-all").length;

			if (repeatNone == 1) {
				var newRepeat = "None";
				if (newRepeat != oldRepeat) {
					oldRepeat = newRepeat;
					ws.send("REPEAT:" + 0);
				}
			}
			if (repeatOne == 1) {
				var newRepeat = "One";
				if (newRepeat != oldRepeat) {
					oldRepeat = newRepeat;
					ws.send("REPEAT:" + 1);
				}
			}
			if (repeatAll == 1) {
				var newRepeat = "All";
				if (newRepeat != oldRepeat) {
					oldRepeat = newRepeat;
					ws.send("REPEAT:" + 2);
				}
			}

			var newShuffle = document.getElementsByClassName("m-shuffling").length;
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				ws.send("SHUFFLE:" + newShuffle);
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
		throw e;
	}
}
open();
