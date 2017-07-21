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

var albumChanged = false;

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
	ws.send("PLAYER:Pandora");
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

function parseFallback(str) {
	str = str.replace(/-/g, ' ');
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

var onMessage = function(event) {
	if (event.data.toLowerCase() == "playpause") {
		document.getElementsByClassName("PlayButton")[0].click();
	}
	else if (event.data.toLowerCase() == "next") {
		document.getElementsByClassName("SkipButton")[0].click();
	}
	else if (event.data.toLowerCase() == "previous") {
		document.getElementsByClassName("ReplayButton")[0].click();
	}
	else if (event.data.toLowerCase().includes("setposition ")) {
		var position = event.data.toLowerCase();
		//+9 because "position " is 9 chars
		position = position.substring(position.indexOf("position ") + 9);
		//Goto the : at the end of the command, this command is now a compound command the first half is seconds the second is percent
		position = parseInt(position.substring(0, position.indexOf(":")));

		document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].currentTime = position;
	}
	else if (event.data.toLowerCase().includes("setvolume ")) {
		var volume = event.data.toLowerCase();
		//+7 because "volume " is 7 chars
		volume = parseInt(volume.substring(volume.indexOf("volume ") + 7)) / 100;
		if(volume > 1)
		{
			volume = 1;
		}
		else if (volume < 0)
		{
			volume = 0;
		}

		document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].volume = volume;
	}
	else if (event.data.toLowerCase() == "shuffle") {
		document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].click();
	}
	else if (event.data.toLowerCase() == "togglethumbsup") {
		document.getElementsByClassName("ThumbUpButton ")[0].click();
	}
	else if (event.data.toLowerCase() == "togglethumbsdown") {
		document.getElementsByClassName("ThumbDownButton")[0].click();
	}
	else if (event.data.toLowerCase().includes("rating ")) {
		var rating = event.data.toLowerCase();
		//+7 because "rating " is 7 chars
		rating = parseInt(rating.substring(rating.indexOf("rating ") + 7));

		if (rating > 3) {
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length === 0) {

				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
		}
		else if (rating < 3) {
			if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length === 0) {

				document.getElementsByClassName("ThumbDownButton")[0].click();
			}
		}
		else {
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length > 0) {

				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
			else if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length > 0) {

				document.getElementsByClassName("ThumbDownButton")[0].click();
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
		if (document.getElementsByClassName("Tuner__Audio__TrackDetail__title").length > 0) {

			var newTitle = document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].innerText;
			if (newTitle != oldTitle) {
				oldTitle = newTitle;
				ws.send("TITLE:" + newTitle);
			}

			var newArtist = document.getElementsByClassName("Tuner__Audio__TrackDetail__artist")[0].innerText;
			if (newArtist != oldArtist) {
				oldArtist = newArtist;
				ws.send("ARTIST:" + newArtist);
			}

			//Use the small album art since it always exists and string repalce to the big one
			var newAlbumArt = document.getElementsByClassName("ImageLoader__cover")[document.getElementsByClassName("ImageLoader__cover").length - 1].src;
			if (newAlbumArt != oldAlbumArt) {
				oldAlbumArt = newAlbumArt;
				ws.send("COVER:" + newAlbumArt.replace("90W_90H", "500W_500H"));
				albumChanged = true;
			}

			if (document.getElementsByClassName("nowPlayingTopInfo__current__albumName").length > 0) {
				var newAlbum = document.getElementsByClassName("nowPlayingTopInfo__current__albumName")[0].innerText;
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum);
					albumChanged = false;
				}
			}
			//Fallback for it album is not visable, note that it is url formatted so I probably should do some extra parsing in the future
			//This will only run if the album has changed
			else if (albumChanged) {
				//Do all extra pasing in advance so string check works accross both if I already have the string set correctly
				var newAlbum = document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].children[0].href.replace("://www.pandora.com/artist/", "");
				newAlbum = newAlbum.substring(newAlbum.indexOf("/") + 1);
				newAlbum = parseFallback(newAlbum.substring(0, newAlbum.indexOf("/")));
				if (newAlbum != oldAlbum) {
					oldAlbum = newAlbum;
					ws.send("ALBUM:" + newAlbum);
					albumChanged = false;
				}
			}


			var newDur = document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[2].innerText;
			if (newDur != oldDur) {
				oldDur = newDur;
				ws.send("DURATION:" + newDur);
			}

			var newPos = document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[0].innerText;
			if (newPos != oldPos) {
				oldPos = newPos;
				ws.send("POSITION:" + newPos);
			}

			//For some reason the width of pandora volume is a fixed 80px so it is on a scale of 0-80
			var newVolume = document.getElementsByTagName('audio')[document.getElementsByTagName('audio').length-1].volume;
			if (newVolume != oldVolume) {
				oldVolume = newVolume;
				ws.send("VOLUME:" + parseFloat(newVolume) * 100);
			}

			var newShuffle = document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].innerText.includes("On");
			if (newShuffle != oldShuffle) {
				oldShuffle = newShuffle;
				var Shuffle = 0;

				if (newShuffle) {
					Shuffle = 1;
				}
				ws.send("SHUFFLE:" + Shuffle);
			}

			var thumbsUp = document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length;
			var thumbsDown = document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length;

			if (thumbsUp > 0) {
				var newLiked = 5;
				if (newLiked != oldLiked) {
					oldLiked = newLiked;
					ws.send("RATING:" + newLiked);
				}
			}
			else if (thumbsDown > 0) {
				var newLiked = 1;
				if (newLiked != oldLiked) {
					oldLiked = newLiked;
					ws.send("RATING:" + newLiked);
				}
			}
			else {
				var newLiked = 0;
				if (newLiked != oldLiked) {
					oldLiked = newLiked;
					ws.send("RATING:" + newLiked);
				}
			}

			var newState = document.getElementsByClassName("PlayButton__Icon")[0].children[0].getAttribute("xlink:href").includes("pause");
			if (newState != oldState) {
				oldState = newState;

				if (newState) {
					ws.send("STATE:" + 1);
				}
				else {
					ws.send("STATE:" + 2);
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
	}
}
open();
