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

//For padding zeros since javascript is a horrible language that does not support padding strings
function pad(number, length) {
    var str = number + "";
    while (str.length < length)
		{
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

		console.log("Opening websocket");
	}
	catch (error) {
		console.log("Error:" + error);
	}
}

var onOpen = function() {
	console.log("Opened websocket");
	connected = true;
	ws.send("PLAYER:Amazon Music");
	//@TODO Possibly send all know data right away on open
	sendData = setInterval(function() {
		dataCheck();
	}, 50);
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
		var a = document.getElementsByClassName("playButton")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "next") {
		var a = document.getElementsByClassName("nextButton")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "previous") {
		var a = document.getElementsByClassName("previousButton")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "repeat") {
		var a = document.getElementsByClassName("repeatButton")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
	else if (event.data.toLowerCase() == "shuffle") {
		var a = document.getElementsByClassName("shuffleButton")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	}
};

var onError = function(event) {
	if (typeof event.data != 'undefined') {
		console.log("Websocket Error:" + event.data);
	}
};

function dataCheck() {
	try {
		if (document.getElementsByClassName("trackTitle").length > 1) {
			var newTitle = document.getElementsByClassName("trackTitle")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.getElementsByClassName("trackArtist")[0].innerText;
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			var newAlbum = document.getElementsByClassName("trackSourceLink")[0].innerText;
			if (newAlbum != oldAlbum) {
				oldAlbum = newAlbum;
				ws.send("ALBUM:" + newAlbum.replace(" - ", ""));
			}

			var newAlbumArt = document.getElementsByClassName("largeAlbumArtContainer")[0].children[0].style.backgroundImage;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;

				//Amazon has a placeholder album art, ignore that till the real one loads
				if(newAlbumArt.indexOf("placeholder-album") < 0)
				{
					ws.send("ALBUMART:" + newAlbumArt.replace('url("',"").replace('")',""));
				}
			}

			//Is innerHTML since it hides on mouse over
			var timeFromEnd = document.getElementsByClassName("listViewDuration")[0].innerHTML.replace("-", "");
			var timeFromEndSec = parseInt(timeFromEnd.substring(timeFromEnd.indexOf(":")+1));
			timeFromEndSec += parseInt(timeFromEnd.substring(0, timeFromEnd.indexOf(":"))) * 60;
			var timeFromEndPercent = parseFloat(document.getElementsByClassName("sliderTrackRemainder")[0].style.width.replace("%", ""));

			var newDur = Math.round(timeFromEndSec / timeFromEndPercent * 100);
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + parseInt(newDur / 60) + ":" + pad(Math.round(newDur % 60), 2));
			}

			var newPos = Math.round(timeFromEndSec / timeFromEndPercent * parseFloat(document.getElementsByClassName("scrubberTrack")[0].children[0].style.width.replace("%", "")));
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + parseInt(newPos / 60) + ":" + pad(Math.round(newPos % 60), 2));
			}

      var newVolume = 100 - document.getElementsByClassName("sliderTrackRemainder")[0].style.height.replace("%","");
      if (newVolume != oldVolume) {
        oldVolume = newVolume;
        ws.send("VOLUME:" + newVolume);
      }

      var newRepeat = document.getElementsByClassName("repeatButton")[0].getAttribute("aria-checked");
			if (newRepeat != oldRepeat) {
				oldRepeat = newRepeat;
				ws.send("REPEAT:" + newRepeat.replace("false", "0").replace("true", "2"));
			}

      var newShuffle = document.getElementsByClassName("shuffleButton")[0].getAttribute("aria-checked");
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				ws.send("SHUFFLE:" + newShuffle.replace("false", "0").replace("true", "2"));
			}

			var newState = document.getElementsByClassName("playerIconPause").length;
			if (newState != oldState) {
				oldState = newState;
				state = 2;

				if(newState > 0)
				{
					state = 1;
				}

				ws.send("STATE:" + state);
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
