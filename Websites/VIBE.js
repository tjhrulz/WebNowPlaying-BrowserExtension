//Adds support for VIBE
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownTag = "";
var currTime = "";
var totalTime = "";

function setup()
{
	var VIBEInfoHandler = createNewMusicInfo();

	VIBEInfoHandler.player = function()
	{
		return "VIBE";
	};

	VIBEInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("menu_item item_library").length > 0;
	};

	VIBEInfoHandler.state = function()
	{
		return document.getElementsByClassName("btn_now")[0].className.includes("play") ? 1 : 2;
	};
	VIBEInfoHandler.title = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		/*global currTitle:true*/
		if (currTitle !== document.getElementsByClassName("link")[0].innerText)
		{
			lastKnownTag = "";
		}
		return document.getElementsByClassName("link")[0].innerText;
	};
	VIBEInfoHandler.artist = function()
	{
		var artists = document.getElementsByClassName("artist")[0].innerText;
		return artists.substring(6);
	};
	VIBEInfoHandler.album = function()
	{
		return document.getElementsByClassName("ly_info_area")[0].children[0].title;
	};
	VIBEInfoHandler.cover = function()
	{
		var currCover = document.getElementsByClassName("thumb_cover")[0].children[0].src;
		return currCover.substring(0, currCover.indexOf("&"));
	};
	VIBEInfoHandler.durationString = function()
	{
		var totalTime = document.getElementsByClassName("remain")[0].innerText;
		return totalTime.substring(totalTime.indexOf(":") - 2, totalTime.indexOf(":") + 3);
	};
	VIBEInfoHandler.positionString = function()
	{
		var currTime = document.getElementsByClassName("now")[0].innerText;
		return currTime.substring(currTime.indexOf(":") - 2, currTime.indexOf(":") + 3);
	};
	VIBEInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("bar_status")[0].children[0].style.width) / 100;
	};
	VIBEInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("btn_like")[0].className.includes("on"))
		{
			return 5;
		}
		return 0;
	};
	VIBEInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("btn_repeat")[0].className.includes("once"))
		{
			return 2;
		}
		if (document.getElementsByClassName("btn_repeat")[0].className.includes("all"))
		{
			return 1;
		}
		return 0;
	};
	VIBEInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("btn_shuffle")[0].className.includes("on"))
		{
			return 1;
		}
		return 0;
	};


	var VIBEEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	VIBEEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("menu_item item_library").length > 0;
	};

	VIBEEventHandler.playpause = function()
	{
		document.getElementsByClassName("btn_now")[0].click();
	};
	VIBEEventHandler.next = function()
	{
		document.getElementsByClassName("btn_play_next")[0].click();
	};
	VIBEEventHandler.previous = function()
	{
		document.getElementsByClassName("btn_play_prev")[0].click();
	};
	VIBEEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("playing_progress")[0].getBoundingClientRect();
		progress *= loc.width;

		var a = document.getElementsByClassName("playing_progress")[0].children[0].children[1];
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
	VIBEEventHandler.volume = function(volume) // kanged from Spotify.js
	{
		var loc = document.getElementsByClassName("bar_volume")[0].getBoundingClientRect();
		volume *= loc.width;

		var a = document.getElementsByClassName("bar_volume")[0].children[0].children[0];
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
	VIBEEventHandler.repeat = function()
	{
		document.getElementsByClassName("btn_repeat")[0].click();
	};
	VIBEEventHandler.shuffle = function()
	{
		document.getElementsByClassName("btn_shuffle")[0].click();
	};
	VIBEEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("btn_like")[0].click();
	};
}

setup();
init();
