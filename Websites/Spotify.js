//Adds support for Spotify
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownTitle = "";
var lastKnownAlbum = "";
var lastKnownAlbumArt = "";

//No longer sent to Rainmeter, now just used to know when to regenerate info
var lastKnownAlbumID = "";

function setup()
{
	var spotifyInfoHandler = createNewMusicInfo();

	spotifyInfoHandler.player = function()
	{
		return "Spotify";
	};

	spotifyInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("Root__now-playing-bar").length > 0 && document.getElementsByClassName("Root__now-playing-bar")[0].innerText.length > 0;
	};

	spotifyInfoHandler.state = function()
	{
		return document.getElementsByClassName("player-controls__buttons")[0].children[2].getAttribute("aria-label").includes("Pause") ? 1 : 2;
	};
	spotifyInfoHandler.title = function()
	{
		if(lastKnownTitle != document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[1].children[0].innerText)
		{
			lastKnownAlbumArt = "";
			lastKnownTitle = document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[1].children[0].innerText;
		}
		return lastKnownTitle;
	};
	spotifyInfoHandler.artist = function()
	{
		return document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[1].children[1].innerText;
	};
	spotifyInfoHandler.album = null;
	spotifyInfoHandler.cover = function()
	{
		//If album art is blank update it
		if(lastKnownAlbumArt === "")
		{
			lastKnownAlbumArt = document.getElementsByClassName("cover-art")[0].children[0].children[1].src;
		}
		//If album art is not blank and we have 3 album art then it must be the big version on display so update to current album art
		else if(document.getElementsByClassName("cover-art").length === 3)
		{
			lastKnownAlbumArt = document.getElementsByClassName("cover-art")[0].children[0].children[1].src;
		}
		//If it was not blnak and we have less than 3 album art then it is already set to the small album art or it is set to the big album art and the big album art is not visible
		return lastKnownAlbumArt;
	};
	spotifyInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("playback-bar")[0].children[2].innerText;
	};
	spotifyInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("playback-bar")[0].children[0].innerText;
	};
	spotifyInfoHandler.volume = function()
	{

		return parseFloat(document.getElementsByClassName("volume-bar")[0].children[1].children[0].children[0].children[1].style.left.replace("%", "")) / 100;
	};
	spotifyInfoHandler.rating = function()
	{
		//I have to check if it equal to true if I cast it since javascript is javascript
		if (document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute("aria-checked") == "true")
		{
			return 5;
		}
		return 0;
	};
	spotifyInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("player-controls__buttons")[0].children[4].getAttribute("aria-checked") == "true")
		{
			return 1;
		}
		if (document.getElementsByClassName("player-controls__buttons")[0].children[4].getAttribute("aria-checked") == "mixed")
		{
			return 2;
		}
		return 0;
	};
	spotifyInfoHandler.shuffle = function()
	{
		return document.getElementsByClassName("player-controls__buttons")[0].children[0].getAttribute("aria-checked") == "true" ? 1 : 0;
	};


	var spotifyEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	spotifyEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("Root__now-playing-bar").length > 0 && document.getElementsByClassName("Root__now-playing-bar")[0].innerText.length > 0;
	};

	spotifyEventHandler.playpause = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[2].click();
	};
	spotifyEventHandler.next = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[3].click();
	};
	spotifyEventHandler.previous = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[1].click();
	};
	spotifyEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("playback-bar")[0].children[1].children[0].getBoundingClientRect();
		progress *= loc.width;

		var a = document.getElementsByClassName("playback-bar")[0].children[1].children[0];
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
	};
	spotifyEventHandler.volume = function(volume)
	{
		var loc = document.getElementsByClassName("volume-bar")[0].children[1].children[0].getBoundingClientRect();
		volume *= loc.width;

		var a = document.getElementsByClassName("volume-bar")[0].children[1].children[0];
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
	};
	spotifyEventHandler.repeat = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[4].click();
	};
	spotifyEventHandler.shuffle = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[0].click();
	};
	spotifyEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].click()
	};
	spotifyEventHandler.toggleThumbsDown = null;
	spotifyEventHandler.rating = function(rating)
	{
		if (rating > 3)
		{
			if (document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute("aria-checked") != "true")
			{
				document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].click()
			}
		}
		else
		{
			if (document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute("aria-checked") == "true")
			{
				document.getElementsByClassName("Root__now-playing-bar")[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].click()
			}
		}
	};
}


setup();
init();
